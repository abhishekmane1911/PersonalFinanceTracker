from django.db.models import Sum
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
import csv
import requests
import logging
from django.http import HttpResponse
from .models import Transaction, Budget
from .serializers import TransactionSerializer, BudgetSerializer

logger = logging.getLogger(__name__)

# Transaction endpoints with filtering support
class TransactionListCreateView(generics.ListCreateAPIView):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ["transaction_type", "category"]
    ordering_fields = ["transaction_date", "amount"]

    def get_queryset(self):
        queryset = Transaction.objects.filter(user=self.request.user)
        start_date = self.request.query_params.get("start_date")
        end_date = self.request.query_params.get("end_date")
        if start_date and end_date:
            queryset = queryset.filter(transaction_date__range=[start_date, end_date])
        return queryset

    def perform_create(self, serializer):
        """Automatically associate the transaction with the logged-in user"""
        serializer.save(user=self.request.user)
    
    
# Budget endpoints with dynamically computed fields
class BudgetListCreateView(generics.ListCreateAPIView):
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        budget = serializer.save(user=request.user)  # Save the budget with the user
        return Response(serializer.data, status=status.HTTP_201_CREATED)

# API endpoint for monthly summary of income and expenses
class MonthlySummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        month = request.query_params.get("month")  # expected format: 'YYYY-MM'
        if not month:
            return Response(
                {"error": "Month parameter is required in format YYYY-MM"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        income = (
            Transaction.objects.filter(
                user=request.user,
                transaction_type="income",
                transaction_date__startswith=month,
            ).aggregate(total_income=Sum("amount"))
            .get("total_income")
            or 0
        )
        expenses = (
            Transaction.objects.filter(
                user=request.user,
                transaction_type="expense",
                transaction_date__startswith=month,
            ).aggregate(total_expenses=Sum("amount"))
            .get("total_expenses")
            or 0
        )
        summary = {
            "month": month,
            "income": income,
            "expenses": expenses,
            "net_balance": income - expenses,
        }
        return Response(summary, status=status.HTTP_200_OK)

# API endpoint to export transactions as CSV (PDF export can be similarly added)
class ExportTransactionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Export transactions as CSV with proper error handling"""
        try:
            # Get filtered transactions
            transactions = Transaction.objects.filter(
                user=request.user
            ).order_by('-transaction_date')
            
            # Create CSV response
            response = HttpResponse(
                content_type='text/csv',
                headers={'Content-Disposition': 'attachment; filename="transactions.csv"'},
            )

            writer = csv.writer(response)
            writer.writerow(['Date', 'Amount', 'Category', 'Type', 'Description'])

            if not transactions.exists():
                writer.writerow(['No transactions found for the current user'])
                return response

            for tx in transactions:
                writer.writerow([
                    tx.transaction_date.strftime('%Y-%m-%d'),
                    f'{float(tx.amount):.2f}',
                    tx.category,
                    tx.transaction_type.capitalize(),
                    tx.description or 'N/A'
                ])

            return response

        except Exception as e:
            logger.error(f"CSV Export Error: {str(e)}", exc_info=True)
            return HttpResponse(
                "Error generating export. Please try again later.",
                status=500,
                content_type='text/plain'
            )


# Currency conversion endpoint using an external API (e.g., CurrencyLayer)
class CurrencyConversionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            amount = float(request.query_params.get("amount", 0))
            from_currency = request.query_params.get("from_currency", "USD")
            to_currency = request.query_params.get("to_currency", "INR")
        except ValueError:
            return Response(
                {"error": "Invalid amount value."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        # Replace with your actual API key
        api_key = "bcb4179cab1f4e1d0e951ef20a1083c7"
        url = (
            f"http://api.currencylayer.com/convert?access_key={api_key}"
            f"&from={from_currency}&to={to_currency}&amount={amount}"
        )
        r = requests.get(url)
        if r.status_code == 200:
            data = r.json()
            converted_amount = data.get("result")
            if converted_amount is not None:
                return Response({"converted_amount": converted_amount})