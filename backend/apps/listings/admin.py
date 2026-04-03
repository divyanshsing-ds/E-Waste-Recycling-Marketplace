from django.contrib import admin
from .models import Listing


@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = ["title", "user", "category", "status", "view_count", "created_at"]
    list_filter = ["category", "status", "condition"]
    search_fields = ["title", "description", "pickup_address"]
    readonly_fields = ["view_count", "created_at", "updated_at"]
