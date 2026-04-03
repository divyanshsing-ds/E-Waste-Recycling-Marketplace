import uuid
from django.db import models
from simple_history.models import HistoricalRecords


class Order(models.Model):
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("in_transit", "In Transit"),
        ("reached", "Reached Location"),
        ("picked_up", "Picked Up"),
        ("completed", "Completed"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    listing = models.OneToOneField("listings.Listing", on_delete=models.CASCADE, related_name="order")
    bid = models.OneToOneField("bids.Bid", on_delete=models.CASCADE, related_name="order")
    
    vendor_lat = models.FloatField(null=True, blank=True)
    vendor_lng = models.FloatField(null=True, blank=True)
    vendor_last_seen = models.DateTimeField(null=True, blank=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    scheduled_time = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    history = HistoricalRecords()

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Order {self.id} for {self.listing.title}"
