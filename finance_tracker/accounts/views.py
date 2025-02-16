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
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        
        # Check if user exists firs
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response(
                {'error': 'No user found with this username'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Attempt authentication
        user = authenticate(username=username, password=password)
        
        if not user:
            return Response(
                {'error': 'Incorrect password'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        if not user.is_active:
            return Response(
                {'error': 'This account is inactive'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        tokens = get_tokens_for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'access_token': tokens['access'],
            'refresh_token': tokens['refresh']
        }, status=status.HTTP_200_OK)