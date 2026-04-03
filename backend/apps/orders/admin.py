from django.contrib import admin
from .models import Order


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ["listing", "status", "vendor_last_seen", "created_at"]
    list_filter = ["status"]
    readonly_fields = ["vendor_last_seen", "created_at", "updated_at"]
