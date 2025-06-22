"""

Autor: Javier -amjavip

Notas:

Recuerda que puedes encontrar informacion mas resumida en la documentacion del proyecto
puedes encontrarla en http://127.0.0.1:8000/users/api/docs/ esta la encontraras al momento
de iniciar el servidor del backend.

Si estas usando una version de python igual o superior a la 3.12 es importante que algunas
librerias no estan disponibles debido a que se consideran obsoletas, para evitar estos problemas
de recomienda usar la version 3.10 ya que con esta versiona sido desarrollado este programa.

Para cualquier aclaracion especifica visita la documentacion de django consultala en este link
https://www.django-rest-framework.org/

"""

from rest_framework.permissions import AllowAny
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SellerViewSet,
    CollectorViewSet,
    RegisterUserView,
    LoginView,
    SendResetEmailView,
)
from rest_framework.documentation import include_docs_urls
from .views import check_username, UpdateUserView, check_pass, ChangePasswordView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


# Enrutador para los viewsets de Seller y Collector (CRUD)
router = DefaultRouter()
router.register(r"sellers", SellerViewSet)
router.register(r"collectors", CollectorViewSet)

urlpatterns = [
    # URLs de los ViewSets
    path("api/users/", include(router.urls)),
    # URL para la documentación de la API (si la tienes habilitada)
    path(
        "api/docs/",
        include_docs_urls(title="CycleMetal API", permission_classes=[AllowAny]),
    ),
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
]
