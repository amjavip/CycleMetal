from django.urls import path
from .views import ItemCatalogView, CreateOrderView

urlpatterns = [
    path('api/catalog/', ItemCatalogView.as_view(), name='item-catalog'),
    path('api/order/create/', CreateOrderView.as_view(), name='neworder'),
    
]
