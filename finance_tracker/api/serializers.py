from rest_framework import serializers
from django.db.models import Sum
from .models import Transaction, Budget

class TransactionSerializer(serializers.ModelSerializer):
    amount = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        coerce_to_string=False  # Crucial change
    )

    class Meta:
        model = Transaction
        fields = [
            "id",
            "amount",
            "category",
            "description",
            "transaction_date",
            "transaction_type"
        ]

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)

    def validate_amount(self, value):
        """Ensure the amount is greater than zero."""
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than zero.")
        return value

class BudgetSerializer(serializers.ModelSerializer):
    spent_amount = serializers.SerializerMethodField()
    remaining_amount = serializers.SerializerMethodField()

    class Meta:
        model = Budget
        fields = ["id", "limit", "month", "spent_amount", "remaining_amount"]

    def get_spent_amount(self, obj):
        total_expenses = (
            Transaction.objects.filter(
                user=obj.user,
                transaction_type="expense",
                transaction_date__startswith=obj.month  # expects month in 'YYYY-MM'
            )
            .aggregate(total=Sum("amount"))
            .get("total")
            or 0
        )
        return total_expenses

    def get_remaining_amount(self, obj):
        spent = self.get_spent_amount(obj)
        return obj.limit - spent