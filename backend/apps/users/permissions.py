from rest_framework.permissions import BasePermission


class IsVendor(BasePermission):
    """Allow access only to vendors."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == "VENDOR")


class IsUser(BasePermission):
    """Allow access only to regular users (not vendors)."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == "USER")


class IsOwner(BasePermission):
    """Allow access only to the object owner."""
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user
