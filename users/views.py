from rest_framework import viewsets
from .serializer import SellerSerializer
from .models import Seller
class sellerView(viewsets.ModelViewSet):
    serializer_class = SellerSerializer
    queryset = Seller.objects.all()
    