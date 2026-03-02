from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.schemas import get_schema_view
from rest_framework.permissions import AllowAny
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

# Enrutador para los viewsets
router = DefaultRouter()
router.register(r"orderitem", OrderItemViewSet)
router.register(r"vehicle", VehicleViewSet)

# OpenAPI / Swagger schema
schema_view = get_schema_view(
    title="Orders API",
    permission_classes=[AllowAny],
)

urlpatterns = [
    path("api/order/", include(router.urls)),
    # URL para la documentación de la API
    path("api/schema/", schema_view, name="orders-schema"),
    path("api/catalog/", ItemCatalogView.as_view(), name="item-catalog"),
    path("api/create/", CreateTempOrderView.as_view(), name="neworder"),
    path("api/checkout/", CheckOrderPayment.as_view(), name="checkout"),
    path(
        "api/showPrev/<str:id_seller>/", ShowPreviousOrders.as_view(), name="showPrev"
    ),
    path("api/calcular-ruta-orden/", CalcularRutaOrdenView.as_view(), name="CalcRoute"),
    path("api/nearby/", ShowNearbyOrders.as_view(), name="nearby-orders"),
    path("api/update-vehicle/", UpdateVehicleView.as_view(), name="update-vehicle"),
    path("api/accept-order/", AcceptOrderView.as_view(), name="accept-order"),
    path("api/cancel-order/", CancelOrderView.as_view(), name="cancel-order"),
    path("api/complete-order/", CompleteOrderView.as_view(), name="complete_order"),
]
