from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, CustomLoginView, ProfileView, PublicUserReviewsView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="auth-register"),
    path("login/", CustomLoginView.as_view(), name="auth-login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("profile/", ProfileView.as_view(), name="auth-profile"),
    path("users/<uuid:user_id>/", PublicUserReviewsView.as_view(), name="public-user"),
]
