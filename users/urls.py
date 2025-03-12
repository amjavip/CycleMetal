from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, SellerViewSet, CollectorViewSet
from rest_framework.documentation import include_docs_urls
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'sellers', SellerViewSet)
router.register(r'collectors', CollectorViewSet)

urlpatterns = [
    path('users/', include(router.urls)),
    path('docs/', include_docs_urls(title="Users API"))
]
