from django.urls import path
from .views import (
    TransactionListCreateView,
    BudgetListCreateView,
    MonthlySummaryView,
    ExportTransactionsView,
    CurrencyConversionView,
)

urlpatterns = [
    path("transactions/", TransactionListCreateView.as_view(), name="transactions"),
    path("budgets/", BudgetListCreateView.as_view(), name="budgets"),
    path("monthly-summary/", MonthlySummaryView.as_view(), name="monthly_summary"),
    path("export-transactions/", ExportTransactionsView.as_view(), name="export_transactions"),
    path("currency-conversion/", CurrencyConversionView.as_view(), name="currency_conversion"),
]
