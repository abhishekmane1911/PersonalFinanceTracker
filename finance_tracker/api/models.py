from django.contrib.auth.models import User
from django.db import models

class Transaction(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    transaction_date = models.DateTimeField(auto_now_add=True)
    transaction_type = models.CharField(choices=[('income', 'Income'), ('expense', 'Expense')], max_length=10)

    def __str__(self):
        return f"{self.user.username} - {self.amount} - {self.category}"

class Budget(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    limit = models.DecimalField(max_digits=10, decimal_places=2)
    month = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.user.username} - {self.month}: {self.limit}"