from django.contrib.auth import authenticate
from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get("username")
        password = data.get("password")

        # Authenticate using Django's built-in method
        user = authenticate(username=username, password=password)
        if user is None:
           raise serializers.ValidationError("Invalid username or password")
        if not user.is_active:
           raise serializers.ValidationError("User account is not active")

    # Generate JWT tokens for the authenticated user
        refresh = RefreshToken.for_user(user)

    # Add the token data and serialized user info into the validated output.
        data["user"] = UserSerializer(user).data
        data["refresh"] = str(refresh)
        data["access"] = str(refresh.access_token)
        return data
