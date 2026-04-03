from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import CustomUser


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = CustomUser
        fields = ["email", "password", "full_name", "phone", "role"]

    def create(self, validated_data):
        return CustomUser.objects.create_user(**validated_data)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.role
        token["full_name"] = user.full_name
        token["email"] = user.email
        return token


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            "id", "email", "full_name", "phone", "avatar_url",
            "role", "vendor_score", "total_reviews", "is_verified_vendor",
            "created_at",
        ]
        read_only_fields = ["id", "email", "vendor_score", "total_reviews", "created_at"]
