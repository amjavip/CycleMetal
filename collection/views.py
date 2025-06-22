from rest_framework.views import APIView
from datetime import timedelta
from .models import Item, Order, OrderItem
from .serializer import ItemSerializer, OrderSerializer, OrderItemSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from users.models import User  # Modelo único User con roles
from rest_framework import viewsets
from rest_framework_simplejwt.tokens import AccessToken


class AuthService:
    @staticmethod
    def generate_token_for_order(user):
        token = AccessToken.for_user(user)
        token.set_exp(lifetime=timedelta(minutes=15))
        return str(token)


class CreateTempOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        seller_id = request.data.get("sellerId")
        items = request.data.get("items")
        tip = float(request.data.get("tip", 0))
        location = request.data.get("location", [None, None])
        lat = location[0]
        lon = location[1]

        # Obtener usuario seller validando rol
        try:
            user = User.objects.get(id=seller_id, role="seller")
        except User.DoesNotExist:
            return Response({"error": "Vendedor no encontrado"}, status=404)

        if not items:
            return Response({"error": "No se recibieron items"}, status=400)

        subtotal = 0.00
        order_items = []
        for item in items:
            try:
                item_obj = Item.objects.get(id=item["id"])
                subtotal += float(item_obj.precio) * item["cantidad"]
                order_items.append({"item": item_obj, "cantidad": item["cantidad"]})
            except Item.DoesNotExist:
                return Response({"error": f"Item ID {item['id']} inválido"}, status=400)

        comision = subtotal * 0.10
        subtotal_with_comision = subtotal + comision
        total = subtotal_with_comision + tip

        # Crear orden
        order = Order.objects.create(
            id_seller=user,
            metodo_pago=None,
            status="pending",
            tip=tip,
            lon=lon,
            lat=lat,
            subtotal=subtotal_with_comision,
            comision=comision,
            total=total,
        )

        # Crear OrderItems
        for item in order_items:
            serializer = OrderItemSerializer(
                data={
                    "order": order.id,
                    "item": item["item"].id,
                    "cantidad": item["cantidad"],
                }
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()

        order_token = AuthService.generate_token_for_order(user)

        return Response(
            {
                "id": order.id_order,
                "location": location,
                "total": total,
                "comision": comision,
                "subtotal": subtotal_with_comision,
                "token": order_token,
                "tip": tip,
                "items": items,
            },
            status=201,
        )


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

        # Verificar que el usuario tenga rol collector antes de asignar
        if request.user.role != "collector":
            return Response(
                {"error": "Solo recolectores pueden aceptar ordenes"}, status=403
            )

        # Asigna al recolector que hace la petición
        order.id_collector = request.user
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
