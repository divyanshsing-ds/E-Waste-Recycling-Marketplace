from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema

from .models import Review
from .serializers import ReviewSerializer
from apps.orders.models import Order


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.select_related('reviewer', 'reviewee', 'order').all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        order_id = self.request.data.get("order")
        order = Order.objects.select_related('bid', 'bid__vendor', 'listing', 'listing__user').get(id=order_id)
        
        reviewer = self.request.user
        if reviewer.role == "USER":
            reviewee = order.bid.vendor
        else:
            reviewee = order.listing.user

        serializer.save(reviewer=reviewer, reviewee=reviewee, order=order)
