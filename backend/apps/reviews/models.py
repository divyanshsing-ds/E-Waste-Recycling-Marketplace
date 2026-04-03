import uuid
from django.db import models
from django.db.models import Avg
from django.db.models.signals import post_save
from django.dispatch import receiver


class Review(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.OneToOneField("orders.Order", on_delete=models.CASCADE, related_name="review")
    reviewer = models.ForeignKey("users.CustomUser", on_delete=models.CASCADE, related_name="reviews_given")
    reviewee = models.ForeignKey("users.CustomUser", on_delete=models.CASCADE, related_name="reviews_received")
    rating = models.IntegerField(choices=[(1, 1), (2, 2), (3, 3), (4, 4), (5, 5)])
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.rating} stars for {self.reviewee.full_name}"


@receiver(post_save, sender=Review)
def update_vendor_score(sender, instance, created, **kwargs):
    if created:
        user = instance.reviewee
        avg_rating = Review.objects.filter(reviewee=user).aggregate(Avg("rating"))["rating__avg"]
        total_count = Review.objects.filter(reviewee=user).count()
        user.vendor_score = round(avg_rating, 1) if avg_rating else 5.0
        user.total_reviews = total_count
        user.save()
