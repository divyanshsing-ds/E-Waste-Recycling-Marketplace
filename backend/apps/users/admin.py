from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ["email", "full_name", "role", "vendor_score", "is_verified_vendor", "is_active", "created_at"]
    list_filter = ["role", "is_verified_vendor", "is_active"]
    search_fields = ["email", "full_name", "phone"]
    ordering = ["-created_at"]
    readonly_fields = ["created_at", "vendor_score", "total_reviews"]

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal Info", {"fields": ("full_name", "phone", "avatar_url")}),
        ("Role & Trust", {"fields": ("role", "vendor_score", "total_reviews", "is_verified_vendor")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Dates", {"fields": ("created_at", "last_login")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "full_name", "role", "password1", "password2"),
        }),
    )
