from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from drf_spectacular.utils import extend_schema

from .models import Order
from .serializers import OrderSerializer, OrderLocationSerializer
from apps.users.permissions import IsVendor, IsUser
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.select_related(
        'listing', 'listing__user', 'bid', 'bid__vendor'
    ).all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "VENDOR":
            return Order.objects.filter(bid__vendor=user).select_related(
                'listing', 'listing__user', 'bid', 'bid__vendor'
            )
        return Order.objects.filter(listing__user=user).select_related(
            'listing', 'listing__user', 'bid', 'bid__vendor'
        )

    @action(detail=True, methods=["patch"], permission_classes=[IsAuthenticated, IsVendor])
    @extend_schema(summary="Update order status (Vendor only)")
    def status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get("status")
        if new_status not in [s[0] for s in Order.STATUS_CHOICES]:
            return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)
        
        order.status = new_status
        order.save()
        
        # If completed/picked up, update listing status if needed
        if new_status == "completed":
            order.listing.status = "completed"
            order.listing.save()
        
        # Notify the user (listing owner) about the status change
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"user_{order.listing.user.id}",
            {
                "type": "notification_message",
                "message": f"Update: Your pickup for '{order.listing.title}' is now {order.status.replace('_', ' ')}!",
                "action": "status_update",
                "order_id": str(order.id)
            }
        )
            
        return Response(OrderSerializer(order).data)

    @action(detail=True, methods=["patch"], permission_classes=[IsAuthenticated, IsVendor])
    @extend_schema(summary="Push vendor current GPS location")
    def location(self, request, pk=None):
        order = self.get_object()
        serializer = OrderLocationSerializer(order, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        order = serializer.save(vendor_last_seen=timezone.now())
        
        # Broadcast the new location in real-time
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f"user_{order.listing.user.id}",
            {
                "type": "notification_message",
                "message": "Updating driver location...",
                "action": "location_update",
                "order_id": str(order.id),
                "lat": order.vendor_lat,
                "lng": order.vendor_lng
            }
        )
        return Response(serializer.data)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated, IsVendor])
    @extend_schema(summary="Verify OTP and confirm pickup (Vendor only)")
    def verify_otp(self, request, pk=None):
        order = self.get_object()
        otp = request.data.get("otp")
        
        if not otp:
            return Response({"error": "OTP is required"}, status=status.HTTP_400_BAD_REQUEST)
            
        if order.status == "picked_up":
            return Response({"error": "Order already picked up"}, status=status.HTTP_400_BAD_REQUEST)

        if order.otp == otp:
            order.otp_verified = True
            order.status = "picked_up"
            order.save()
            
            # Notify the user (listing owner)
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                f"user_{order.listing.user.id}",
                {
                    "type": "notification_message",
                    "message": f"Confirmed! Driver has picked up '{order.listing.title}' after verifying OTP.",
                    "action": "otp_verified",
                    "order_id": str(order.id)
                }
            )
            return Response(OrderSerializer(order, context={'request': request}).data)
        else:
            return Response({"error": "Invalid verification code (OTP)"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=["get"])
    @extend_schema(summary="Poll vendor's last-seen location")
    def get_location(self, request, pk=None):
        order = self.get_object()
        return Response({
            "lat": order.vendor_lat,
            "lng": order.vendor_lng,
            "last_seen": order.vendor_last_seen
        })
