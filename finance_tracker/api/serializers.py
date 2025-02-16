from rest_framework import serializers
from .models import Transaction, Budget

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ['id', 'amount', 'description', 'created_at']  # Exclude 'user'

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user  # Auto-assign user
        return super().create(validated_data)

class BudgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Budget
        fields = ['id', 'total_budget', 'spent_amount', 'remaining_amount', 'created_at']  # Exclude 'user'

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user  # Auto-assign user
        return super().create(validated_data)