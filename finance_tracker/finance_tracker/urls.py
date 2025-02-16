from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

# Simple Home View
def home(request):
    return HttpResponse("Welcome to the Finance Tracker App!")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),  # Include your app’s URLs
    path('', home, name='home'),  # Home page
    path('accounts/', include('accounts.urls')),  # Include accounts app URLs
]