from django.urls import path
from .views import TransactionListCreateView, BudgetListCreateView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('transactions/', TransactionListCreateView.as_view(), name='transactions'),
    path('budgets/', BudgetListCreateView.as_view(), name='budgets'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]