from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("APP.urls")),
    path("api/token/", TokenObtainPairView.as_view()),       # login -> get token
    
]
