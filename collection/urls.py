from django.urls import path
from .views import ItemCatalogView

urlpatterns = [
    path('api/catalog/', ItemCatalogView.as_view(), name='item-catalog'),
]
