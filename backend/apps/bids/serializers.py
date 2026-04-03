from rest_framework import serializers
from .models import Bid
from apps.users.serializers import UserProfileSerializer


class BidSerializer(serializers.ModelSerializer):
    vendor = UserProfileSerializer(read_only=True)

    class Meta:
        model = Bid
        fields = ["id", "listing", "vendor", "amount", "message", "status", "created_at"]
        read_only_fields = ["id", "vendor", "status", "created_at"]
