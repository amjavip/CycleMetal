from rest_framework.views import APIView
from datetime import timedelta
from .models import Item, Order, OrderItem
from .serializer import ItemSerializer, OrderSerializer, OrderItemSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from users.models import User  # Modelo único User con roles
from rest_framework import viewsets
from rest_framework_simplejwt.tokens import AccessToken, TokenError
from django.core.exceptions import ObjectDoesNotExist
import stripe
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from math import radians, cos, sin, asin, sqrt
from django.http import JsonResponse


def haversine(lon1, lat1, lon2, lat2):
    """
    Calcula la distancia entre dos puntos en km usando la fórmula de Haversine.
    """
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    c = 2 * asin(sqrt(a))
    r = 6371  # Radio de la Tierra en km
    return c * r


def get_nearby_orders(lat, lon, radio_km):
    """
    Devuelve órdenes 'pending' dentro de un radio dado desde la ubicación del recolector.
    """
    all_pending = Order.objects.filter(status="ontheway")
    nearby = []

    for order in all_pending:
        distance = haversine(lon, lat, order.lon, order.lat)
        if distance <= radio_km:
            nearby.append(
                {
                    "order": OrderSerializer(order).data,
                    "distance_km": round(distance, 2),
                }
            )

    # Opcional: ordena por distancia
    nearby.sort(key=lambda x: x["distance_km"])

    return nearby


stripe.api_key = settings.STRIPE_SECRET_KEY


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
                "date": order.orderCreationDay,
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
    permission_classes = [AllowAny]

    def get(self, request):
        items = Item.objects.all()
        serializer = ItemSerializer(items, many=True)
        return Response(serializer.data)


# TODO debo de verificar el pago si se realizo con tarjeta, para que pase su status a on the way


class CheckOrderPayment(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        cardMethod = request.data.get("paymentMethod")
        token = request.data.get("token")
        idorder = request.data.get("id")

        # Verificar que el token no esté expirado
        try:
            AccessToken(token)
        except TokenError:
            return Response(
                {"error": "El acceso ha expirado, solicita de nuevo el pedido"},
                status=400,
            )

        # 🚀 Pago con tarjeta
        if cardMethod == "card":
            try:
                # Buscar la orden
                try:
                    order = Order.objects.get(id_order=idorder)
                    total = int(float(order.total) * 100)
                except ObjectDoesNotExist:
                    return Response(
                        {"error": "La información de la orden no es válida"},
                        status=404,
                    )

                # Crear el intent con capture manual
                intent = stripe.PaymentIntent.create(
                    amount=total,
                    currency="mxn",
                    capture_method="manual",  # <-- clave para autorizar sin cobrar
                    metadata={"order_id": order.id_order},
                )

                # Guardar el intent ID en la orden
                order.payment_intent_id = intent.id
                order.metodo_pago = "card"
                order.status = "ontheway"
                order.save()

                # Devolver clientSecret al frontend
                return Response({"clientSecret": intent.client_secret}, status=200)

            except Exception as e:
                print(str(e))
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # 💵 Pago en efectivo
        elif cardMethod == "cash":
            try:
                order = Order.objects.get(id_order=idorder)
                order.status = "ontheway"
                order.metodo_pago = "cash"
                order.save()
                return Response({"paymentMethod": order.metodo_pago}, status=200)
            except ObjectDoesNotExist:
                return Response(
                    {
                        "error": "La información de pago no se pudo actualizar. Intenta de nuevo."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        # ❌ Otro método inválido
        else:
            return Response(
                {"error": "Método de pago no válido"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class ShowPreviousOrders(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id_seller):
        if not id:
            return Response(
                {"error": "La informacion que se necesita no ha sido proporcionada"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            orders = Order.objects.filter(id_seller=id_seller)
            serializer = OrderSerializer(orders, many=True)
            return Response(serializer.data, status=200)
        except ObjectDoesNotExist:
            return Response(
                {"error": "No se logro encontrar algun pedido para esta cuenta"},
                status=400,
            )


class ShowNearbyOrders(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        lat = float(request.GET.get("lat"))
        lon = float(request.GET.get("lon"))

        print(lat, lon)
        if not lat or not lon:
            return Response({"error": "No hay suficientes datos"})
        radio = 1  # valor por defecto: 1 km

        orders = get_nearby_orders(lat, lon, radio)
        print(orders)
        return JsonResponse({"orders": orders}, status=200)


class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer
    permission_classes = [IsAuthenticated]
