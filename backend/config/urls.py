from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    path("admin/", admin.site.urls),
    # API schema + docs
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    # App routes
    path("api/auth/", include("apps.users.urls")),
    path("api/listings/", include("apps.listings.urls")),
    path("api/bids/", include("apps.bids.urls")),
    path("api/orders/", include("apps.orders.urls")),
    path("api/reviews/", include("apps.reviews.urls")),
]
