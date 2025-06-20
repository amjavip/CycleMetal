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
from .serializer import OrderSerializer, OrderItemSerializer
from users.models import Seller

from rest_framework import viewsets


def createToken():
    return


class CreateTempOrderView(APIView):
    def post(self, request):
        id = request.data.get("sellerId")
        items = request.data.get("items")
        tip = float(request.data.get("tip"))
        location = request.data.get("location")
        lat = location[0]
        lon = location[1]
        print(lat, lon)

        if items:
            subtotal = 0.00
            sum = 0.00

            orderItem = []
            for item in items:
                try:
                    item_obj = Item.objects.get(id=item["id"])
                    precio = item_obj.precio
                    sum += float(precio) * item["cantidad"]
                    orderItem.append(
                        {
                            "item": item_obj,
                            "cantidad": item["cantidad"],
                        }
                    )
                except Item.DoesNotExist:
                    return Response(
                        {"error": f"Item ID {item['id']} inválido"}, status=400
                    )

            comision = sum * 0.10
            subtotal = sum + comision
            total = subtotal + tip

            order = Order.objects.create(
                id_seller_id=id,
                metodo_pago=None,
                status="pending",
                tip=tip,
                lon=lon,
                lat=lat,
                subtotal=subtotal,
                comision=comision,
                total=total,
            )
            print(order.id_order)
            for item in orderItem:
                print("bien")
                serializer = OrderItemSerializer(
                    data={
                        "order": order.id,
                        "item": item["item"].id,
                        "cantidad": item["cantidad"],
                    }
                )
                serializer.is_valid(raise_exception=True)
                serializer.save()

            return Response({"order_id": order.id_order}, status=201)

        else:
            print("mal")
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


class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer
    permission_classes = [IsAuthenticated]
