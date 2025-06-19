from django.urls import path
from .views import ItemCatalogView, CreateTempOrderView

urlpatterns = [
    path('api/catalog/', ItemCatalogView.as_view(), name='item-catalog'),
    path('api/create/', CreateTempOrderView.as_view(), name='neworder'),
    
]
