from django.urls import path
from .views import (
    ItemCatalogView,
    CreateTempOrderView,
    OrderItemViewSet,
    CheckOrderPayment,
    ShowPreviousOrders,
    ShowNearbyOrders,
    VehicleViewSet,
    UpdateVehicleView,
    CalcularRutaOrdenView,
    AcceptOrderView,
    CancelOrderView,
    CompleteOrderView,
)
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.documentation import include_docs_urls
from rest_framework.permissions import AllowAny

# Enrutador para los viewsets de Seller y Collector (CRUD)
router = DefaultRouter()
router.register(r"orderitem", OrderItemViewSet)
router.register(r"Vehicle", VehicleViewSet)


urlpatterns = [
    path("api/order/", include(router.urls)),
    # URL para la documentación de la API (si la tienes habilitada)
    path(
        "api/docs/",
        include_docs_urls(
            title="Orders API", permission_classes=[AllowAny], urlconf="collection.urls"
        ),
        name="orders-docs",
    ),
    path("api/catalog/", ItemCatalogView.as_view(), name="item-catalog"),
    path("api/create/", CreateTempOrderView.as_view(), name="neworder"),
    path("api/checkout/", CheckOrderPayment.as_view(), name="checkout"),
    path(
        "api/showPrev/<str:id_seller>/", ShowPreviousOrders.as_view(), name="showPrev"
    ),
    path("api/calcular-ruta-orden/", CalcularRutaOrdenView.as_view(), name="CalcRoute"),
    path("api/nearby/", ShowNearbyOrders.as_view(), name="nearby-orders"),
    path("api/update-vehicle/", UpdateVehicleView.as_view(), name="update-vehicle"),
    path("api/accept-order/", AcceptOrderView.as_view(), name="update-vehicle"),
    path("api/cancel-order/", CancelOrderView.as_view(), name="cancel-order"),
    path("api/complete-order/", CompleteOrderView.as_view(), name="complete_order"),
]
