from rest_framework import serializers
from .models import Order
from apps.listings.serializers import ListingSerializer
from apps.bids.serializers import BidSerializer


class OrderSerializer(serializers.ModelSerializer):
    listing = ListingSerializer(read_only=True)
    bid = BidSerializer(read_only=True)

    class Meta:
        model = Order
        fields = [
            "id", "listing", "bid", "vendor_lat", "vendor_lng",
            "vendor_last_seen", "status", "scheduled_time",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "listing", "bid", "created_at", "updated_at"]


class OrderLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ["vendor_lat", "vendor_lng", "vendor_last_seen"]
