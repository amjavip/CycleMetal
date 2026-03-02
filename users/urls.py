from rest_framework.permissions import AllowAny
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.schemas import get_schema_view

from .views import (
    SellerViewSet,
    CollectorViewSet,
    RegisterUserView,
    LoginView,
    SendResetEmailView,
    SellerWeeklyActivity,
    CollectorStatsView,
    UserViewSet,
    check_username,
    UpdateUserView,
    check_pass,
    ChangePasswordView,
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Enrutador para los viewsets de Seller y Collector (CRUD)
router = DefaultRouter()
router.register(r"sellers", SellerViewSet)
router.register(r"collectors", CollectorViewSet)
router.register(r"users", UserViewSet)

# Swagger/OpenAPI schema
schema_view = get_schema_view(
    title="CycleMetal API",
    permission_classes=[AllowAny],
)

urlpatterns = [
    path("api/stats/", CollectorStatsView.as_view()),
    # URLs de los ViewSets
    path("api/users/", include(router.urls)),
    # URL para la documentación de la API
    path("api/schema/", schema_view, name="api-schema"),
    # Verificacion de datos
    path("api/check-username/", check_username, name="check_username"),
    path("api/verify-password/", check_pass, name="check_password"),
    # URL para el registro de un nuevo usuario (Seller o Collector)
    path("api/register/", RegisterUserView.as_view(), name="register_user"),
    path("api/login/", LoginView.as_view(), name="login"),
    # Urls para cambio de datos
    path("api/update/", UpdateUserView.as_view(), name="update"),
    path(
        "api/auth/send-reset-email/",
        SendResetEmailView.as_view(),
        name="send-reset-email",
    ),
    path(
        "api/auth/set-new-password/",
        ChangePasswordView.as_view(),
        name="set-new-password",
    ),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/seller/weekly-activity/", SellerWeeklyActivity.as_view()),
]
