from django.urls import path, include
from rest_framework import routers
from users import views

router = routers.DefaultRouter()
router.register(r'users',  views.sellerView, 'sellerView')
urlpatterns = [
    path("sellerView", include(router.urls))
]
