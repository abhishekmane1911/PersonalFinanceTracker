from django.urls import path
from .views import (
    TransactionListCreateView,
    TransactionDeleteView,  # Import the new delete view
    BudgetListCreateView,
    MonthlySummaryView,
    ExportTransactionsView,
    CurrencyConversionView,
    SpendingAnalysisView,
)

urlpatterns = [
    path("transactions/", TransactionListCreateView.as_view(), name="transactions"),
    path("transactions/<int:pk>/", TransactionDeleteView.as_view(), name="transaction_delete"),  
    path("budgets/", BudgetListCreateView.as_view(), name="budgets"),
    path("monthly-summary/", MonthlySummaryView.as_view(), name="monthly_summary"),
    path("export-transactions/", ExportTransactionsView.as_view(), name="export_transactions"),
    path("currency-conversion/", CurrencyConversionView.as_view(), name="currency_conversion"),
    path("spending-analysis/", SpendingAnalysisView.as_view(), name="spending_analysis"),  

]