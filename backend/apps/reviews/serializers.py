from rest_framework import serializers
from .models import Review
from apps.users.serializers import UserProfileSerializer


class ReviewSerializer(serializers.ModelSerializer):
    reviewer = UserProfileSerializer(read_only=True)

    class Meta:
        model = Review
        fields = ["id", "order", "reviewer", "reviewee", "rating", "comment", "created_at"]
        read_only_fields = ["id", "reviewer", "reviewee", "created_at"]
