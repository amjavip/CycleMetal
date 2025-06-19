# orders/views.py
from rest_framework.views import APIView
from .models import Item
from .serializer import ItemSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializer import OrderSerializer
from .models import Order
from .serializer import Order
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Order, OrderItem, Item
from .serializer import OrderSerializer
from users.models import Seller


def createToken():
    return


class CreateTempOrderView(APIView):
    def post(self, request):
        items = request.data.get("items")
        tip = float(request.data.get("tip"))
        if items:
            subtotal = 0.00
            sum = 0.00
            item_info = []
            for item in items:
                item_obj = Item.objects.get(id=item["id"])
                precio = item_obj.precio
                sum = sum + (float(precio) * item["cantidad"])
                item_info.append({"item_id": item_obj.id, "cantidad": item["cantidad"]})
            comision = sum * 0.10
            subtotal = sum + comision
            total = subtotal + tip

            receipt_info = {
                "comision": float(comision),
                "subtotal": float(subtotal),
                "tip": float(tip),
                "total": float(total),
            }
            resultado = {"items": item_info, "receipt": receipt_info}

            print("resultado:", resultado)
            return Response(status=status.HTTP_400_BAD_REQUEST)

        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class AcceptOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, order_id):
        try:
            order = Order.objects.get(id_order=order_id)
        except Order.DoesNotExist:
            return Response({"error": "Orden no encontrada"}, status=404)

        if order.status != "pending":
            return Response(
                {"error": "Orden ya ha sido aceptada o cancelada"}, status=400
            )

        # Asigna al recolector que hace la petición
        order.id_collector = (
            request.user.collector
        )  # Asumiendo que recolector está relacionado con usuario
        order.status = "ontheway"
        order.save()

        return Response({"message": "Orden aceptada correctamente"})


class ItemCatalogView(APIView):

    def get(self, request):
        items = Item.objects.all()
        serializer = ItemSerializer(items, many=True)
        return Response(serializer.data)
