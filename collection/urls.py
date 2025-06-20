from django.urls import path
from .views import ItemCatalogView, CreateTempOrderView, OrderItemViewSet
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.documentation import include_docs_urls

# Enrutador para los viewsets de Seller y Collector (CRUD)
router = DefaultRouter()
router.register(r"orderitem", OrderItemViewSet)


urlpatterns = [
    path("api/order/", include(router.urls)),
    # URL para la documentación de la API (si la tienes habilitada)
    path("api/docs/", include_docs_urls(title="Orders API")),
    path("api/catalog/", ItemCatalogView.as_view(), name="item-catalog"),
    path("api/create/", CreateTempOrderView.as_view(), name="neworder"),
]
