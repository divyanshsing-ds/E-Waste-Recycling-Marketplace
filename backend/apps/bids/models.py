import uuid
from django.db import models


class Bid(models.Model):
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("accepted", "Accepted"),
        ("rejected", "Rejected"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    listing = models.ForeignKey("listings.Listing", on_delete=models.CASCADE, related_name="bids")
    vendor = models.ForeignKey("users.CustomUser", on_delete=models.CASCADE, related_name="bids")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    message = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("listing", "vendor")
        ordering = ["-amount"]

    def __str__(self):
        return f"{self.vendor.full_name} - ${self.amount} - {self.listing.title}"
