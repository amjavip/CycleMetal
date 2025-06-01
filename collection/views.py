# orders/views.py
from rest_framework.views import APIView
from .models import Item
from .serializer import ItemSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializer import OrderSerializer
from .models import Order
class AcceptOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, order_id):
        try:
            order = Order.objects.get(id_order=order_id)
        except Order.DoesNotExist:
            return Response({"error": "Orden no encontrada"}, status=404)

        if order.status != 'pending':
            return Response({"error": "Orden ya ha sido aceptada o cancelada"}, status=400)

        # Asigna al recolector que hace la petición
        order.id_collector = request.user.collector  # Asumiendo que recolector está relacionado con usuario
        order.status = 'ontheway'
        order.save()

        return Response({"message": "Orden aceptada correctamente"})


class ItemCatalogView(APIView):
 
    def get(self, request):
        items = Item.objects.all()
        serializer = ItemSerializer(items, many=True)
        return Response(serializer.data)