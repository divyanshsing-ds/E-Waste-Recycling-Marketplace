from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from drf_spectacular.utils import extend_schema

from .models import Bid
from .serializers import BidSerializer
from apps.users.permissions import IsVendor, IsOwner
from apps.orders.models import Order
from apps.listings.models import Listing
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer


class BidViewSet(ModelViewSet):
    queryset = Bid.objects.select_related('listing', 'listing__user', 'vendor').all()
    serializer_class = BidSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        listing_id = self.request.query_params.get("listing")
        
        if listing_id:
            qs = qs.filter(listing_id=listing_id)
            
        if user.role == "VENDOR":
            return qs.filter(vendor=user)
        return qs.filter(listing__user=user)

    @extend_schema(summary="Place a bid on a listing")
    def perform_create(self, serializer):
        listing = serializer.validated_data.get('listing')
        vendor = self.request.user
        
        # Check if vendor already has a bid on this listing
        existing_bid = Bid.objects.filter(listing=listing, vendor=vendor).first()
        
        if existing_bid:
            # Update the existing bid instead of creating a new one
            existing_bid.amount = serializer.validated_data.get('amount')
            existing_bid.message = serializer.validated_data.get('message', existing_bid.message)
            existing_bid.save()
            bid = existing_bid
        else:
            bid = serializer.save(vendor=vendor)

        # Send real-time notification to listing owner
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"user_{listing.user.id}",
            {
                "type": "notification_message",
                "message": f"{bid.vendor.full_name} placed/updated a bid of ${bid.amount} on your listing: {bid.listing.title}",
                "action": "new_bid",
                "listing_id": str(listing.id),
            }
        )

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    @extend_schema(summary="Accept a bid and create an order")
    def accept(self, request, pk=None):
        bid = self.get_object()
        listing = bid.listing

        if listing.user != request.user:
            return Response({"error": "Only the listing owner can accept bids"}, status=status.HTTP_403_FORBIDDEN)

        if listing.status != "open":
            return Response({"error": "Listing is no longer open"}, status=status.HTTP_400_BAD_REQUEST)
        with transaction.atomic():
            bid.status = "accepted"
            bid.save()
            listing.status = "closed"
            listing.save()
            # Reject other bids
            listing.bids.filter(status="pending").exclude(id=bid.id).update(status="rejected")
            # Create Order
            order = Order.objects.create(listing=listing, bid=bid)

        # Notify vendor that bid was accepted
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"user_{bid.vendor.id}",
            {
                "type": "notification_message",
                "message": f"Your bid for {listing.title} has been accepted!",
                "action": "bid_accepted",
                "listing_id": str(listing.id),
                "order_id": str(order.id),
            }
        )

        return Response({"message": "Bid accepted and order created"}, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    @extend_schema(summary="Reject a bid")
    def reject(self, request, pk=None):
        bid = self.get_object()
        if bid.listing.user != request.user:
            return Response({"error": "Only the listing owner can reject bids"}, status=status.HTTP_403_FORBIDDEN)
        bid.status = "rejected"
        bid.save()
        return Response({"message": "Bid rejected"}, status=status.HTTP_200_OK)
