from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django.db.models import F
from drf_spectacular.utils import extend_schema, OpenApiParameter

from .models import Listing
from .serializers import ListingSerializer
from .filters import ListingFilter
from apps.users.permissions import IsOwner, IsUser
from utils.geo import haversine_distance


class ListingViewSet(viewsets.ModelViewSet):
    queryset = Listing.objects.select_related('user').all()
    serializer_class = ListingSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filterset_class = ListingFilter

    def get_queryset(self):
        qs = super().get_queryset()
        lat = self.request.query_params.get("lat")
        lng = self.request.query_params.get("lng")
        radius = self.request.query_params.get("radius")

        if lat and lng and radius:
            try:
                lat, lng, radius = float(lat), float(lng), float(radius)
                ids = [
                    l.id for l in qs if haversine_distance(lat, lng, l.pickup_lat, l.pickup_lng) <= radius
                ]
                qs = qs.filter(id__in=ids)
            except ValueError:
                pass
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        Listing.objects.filter(id=instance.id).update(view_count=F("view_count") + 1)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @extend_schema(summary="List and filter e-waste items")
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated, IsOwner])
    @extend_schema(summary="Upload an image to Cloudinary")
    def image(self, request, pk=None):
        import cloudinary
        import cloudinary.uploader
        from django.conf import settings
        
        listing = self.get_object()
        file = request.FILES.get("image")
        if not file:
            return Response({"error": "No image provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            cloudinary.config(
                cloud_name=settings.CLOUDINARY_STORAGE['CLOUD_NAME'],
                api_key=settings.CLOUDINARY_STORAGE['API_KEY'],
                api_secret=settings.CLOUDINARY_STORAGE['API_SECRET']
            )
            upload_data = cloudinary.uploader.upload(file)
            listing.image_url = upload_data.get('secure_url')
            listing.save(update_fields=['image_url'])
            return Response(
                {"message": "Image uploaded successfully", "image_url": listing.image_url}, 
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
