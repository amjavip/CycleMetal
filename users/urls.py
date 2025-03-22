from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SellerViewSet, CollectorViewSet, RegisterUserView
from rest_framework.documentation import include_docs_urls

# Enrutador para los viewsets de Seller y Collector (CRUD)
router = DefaultRouter()
router.register(r'sellers', SellerViewSet)
router.register(r'collectors', CollectorViewSet)

urlpatterns = [
    # URLs de los ViewSets
    path('api/users/', include(router.urls)),
    
    # URL para la documentación de la API (si la tienes habilitada)
    path('api/docs/', include_docs_urls(title="Users API")),
    
    # URL para el registro de un nuevo usuario (Seller o Collector)
    path('api/register/', RegisterUserView.as_view(), name='register_user'),
]
