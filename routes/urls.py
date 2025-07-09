from django.urls import path
from .views import ActiveRouteView
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.documentation import include_docs_urls
from rest_framework.permissions import AllowAny


urlpatterns = [
    path("api/active-route/", ActiveRouteView.as_view(), name="active-route"),
]
