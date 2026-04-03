from django_filters import rest_framework as filters
from .models import Listing


class ListingFilter(filters.FilterSet):
    category = filters.CharFilter(lookup_expr="iexact")
    status = filters.CharFilter(lookup_expr="iexact")
    lat = filters.NumberFilter(field_name="pickup_lat", method="filter_nearby")
    lng = filters.NumberFilter(field_name="pickup_lng", method="filter_nearby")
    radius = filters.NumberFilter(method="filter_nearby")

    class Meta:
        model = Listing
        fields = ["category", "status", "user"]

    def filter_nearby(self, queryset, name, value):
        # We handle this logic in the view because we need lat, lng, and radius together
        return queryset
