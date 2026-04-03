import uuid
from django.db import models
from simple_history.models import HistoricalRecords


class Listing(models.Model):
    CATEGORY_CHOICES = (
        ("phone", "Phone"),
        ("laptop", "Laptop"),
        ("tv", "TV"),
        ("appliance", "Appliance"),
        ("other", "Other"),
    )
    CONDITION_CHOICES = (
        ("good", "Good"),
        ("fair", "Fair"),
        ("poor", "Poor"),
    )
    STATUS_CHOICES = (
        ("open", "Open"),
        ("closed", "Closed"),
        ("completed", "Completed"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey("users.CustomUser", on_delete=models.CASCADE, related_name="listings")
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES)
    image_url = models.URLField(max_length=500, blank=True)
    pickup_lat = models.FloatField()
    pickup_lng = models.FloatField()
    pickup_address = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="open")
    view_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    history = HistoricalRecords()

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title
