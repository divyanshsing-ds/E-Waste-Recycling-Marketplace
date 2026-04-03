from rest_framework import serializers
from .models import Listing
from apps.users.serializers import UserProfileSerializer


class ListingSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)

    class Meta:
        model = Listing
        fields = [
            "id", "user", "title", "description", "category",
            "condition", "image_url", "pickup_lat", "pickup_lng",
            "pickup_address", "status", "view_count", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "user", "view_count", "created_at", "updated_at"]
