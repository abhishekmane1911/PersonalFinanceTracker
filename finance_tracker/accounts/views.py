from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, LoginSerializer, UserSerializer
from django.contrib.auth.models import User

# Generate JWT Token Function
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

# Register View
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

# Login View
class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
    # Validate incoming data and perform authentication inside the serializer.
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
    
        validated_data = serializer.validated_data
    
    # Return the tokens and user information as response.
        return Response({
          "user": validated_data.get("user"),
          "access_token": validated_data.get("access"),
          "refresh_token": validated_data.get("refresh"),
        }, status=status.HTTP_200_OK)
