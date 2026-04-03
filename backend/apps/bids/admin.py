from django.contrib import admin
from .models import Bid


@admin.register(Bid)
class BidAdmin(admin.ModelAdmin):
    list_display = ["listing", "vendor", "amount", "status", "created_at"]
    list_filter = ["status"]
    search_fields = ["listing__title", "vendor__email", "message"]
