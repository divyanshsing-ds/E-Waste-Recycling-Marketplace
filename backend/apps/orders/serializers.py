from rest_framework import serializers
from .models import Order
from apps.listings.serializers import ListingSerializer
from apps.bids.serializers import BidSerializer


class OrderSerializer(serializers.ModelSerializer):
    listing = ListingSerializer(read_only=True)
    bid = BidSerializer(read_only=True)
    otp = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            "id", "listing", "bid", "vendor_lat", "vendor_lng",
            "vendor_last_seen", "status", "scheduled_time",
            "otp", "otp_verified",
            "created_at", "updated_at",
        ]
        read_only_fields = ["id", "listing", "bid", "created_at", "updated_at", "otp_verified"]

    def get_otp(self, obj):
        request = self.context.get('request')
        if request and request.user.id == obj.listing.user.id:
            return obj.otp
        return None


class OrderLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ["vendor_lat", "vendor_lng", "vendor_last_seen"]
