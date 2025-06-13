# orders/views.py
from rest_framework.views import APIView
from .models import Item
from .serializer import ItemSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializer import OrderSerializer
from .models import Order
# orders/views.py
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Order, OrderItem, Item
from .serializer import OrderSerializer
from users.models import Seller

class CreateOrderView(APIView):
   

    def post(self, request):
        user_id = request.data.get('id')
        

        # Aquí recibimos toda la info para la orden y los items
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            # Guardamos la orden con todos los items
            order = serializer.save(id_seller=user_id)  # Asignamos seller automáticamente si tiene relación

            return Response({
                "message": "Orden creada con éxito",
                "order_id": order.id_order,
                "total": order.total
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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