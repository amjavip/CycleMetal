from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SellerViewSet, CollectorViewSet, RegisterUserView, LoginView
from rest_framework.documentation import include_docs_urls
from .views import check_username, UpdateUserView

# Enrutador para los viewsets de Seller y Collector (CRUD)
router = DefaultRouter()
router.register(r'sellers', SellerViewSet)
router.register(r'collectors', CollectorViewSet)

urlpatterns = [
    # URLs de los ViewSets
    path('api/users/', include(router.urls)),
    
    # URL para la documentación de la API (si la tienes habilitada)
    path('api/docs/', include_docs_urls(title="Users API")),
    path('api/check-username/', check_username, name='check_username'),
    # URL para el registro de un nuevo usuario (Seller o Collector)
    path('api/register/', RegisterUserView.as_view(), name='register_user'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/update/', UpdateUserView.as_view(), name='update')

]
