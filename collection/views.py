from rest_framework.views import APIView
from datetime import timedelta
from .models import Item, Order, OrderItem, Vehicle
from .serializer import (
    ItemSerializer,
    OrderSerializer,
    OrderItemSerializer,
    VehicleSerializer,
)
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

import requests
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


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
    print(lat, lon, radio_km, all_pending)

    for order in all_pending:
        distance = haversine(lon, lat, order.lon, order.lat)
        print("xdxdxdxdxxdxdxxdxdxdxdxddx", distance)
        if distance and distance <= radio_km:

            nearby.append(
                {
                    "order": OrderSerializer(order).data,
                    "distance_km": round(distance, 2),
                }
            )

    # Opcional: ordena por distancia
    nearby.sort(key=lambda x: x["distance_km"])
    print(nearby)
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
        tip = float(request.data.get("tip"))
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
                "id": order.id,
                "location": location,
                "total": total,
                "comision": comision,
                "subtotal": subtotal_with_comision,
                "token": order_token,
                "tip": order.tip,
                "items": items,
                "date": order.orderCreationDay,
            },
            status=201,
        )


class AcceptOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if user.role != "collector":
            return Response(
                {"error": "No puedes acceder a esta funcion sin ssr un recolector"},
                status=400,
            )
        collector = user.collectorprofile
        if collector.has_active_route:
            return Response({"error": "Tienes una ruta activa"}, status=400)
        order_id = request.data.get("order_id")
        geometry = request.data.get("geometry")
        distance = request.data.get("distance")
        start_lat = request.data.get("start_lat")
        start_lon = request.data.get("start_lon")
        end_lat = request.data.get("end_lat")
        end_lon = request.data.get("end_lon")

        # Verificar si el recolector ya tiene una ruta activa

        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response({"error": "Orden no encontrada."}, status=404)

        # Validar que la orden esté disponible
        if order.status != "ontheway":
            return Response(
                {"error": "La orden ya fue tomada por otro recolector."}, status=400
            )
        if Route.objects.filter(order_id=order_id).exists():
            # Ya existe ruta, maneja el caso: error o retorna la existente
            return Response({"error": "Ruta para esta orden ya existe"}, status=400)
        # Cambiar estado de la orden
        order.status = "accepted"
        order.id_collector = user
        order.save()

        # Crear ruta
        route = Route.objects.create(
            order=order,
            lat=start_lat,
            lon=start_lon,
            endlat=end_lat,
            endlon=end_lon,
            routeDistance=distance,
            routeGeometry=geometry,
        )
        collector.has_active_route = True
        collector.save()
        return Response(
            {
                "message": "Ruta creada exitosamente",
                "route_id": route.id,
                "has_active_route": True,
                "order": OrderSerializer(order).data,
            },
            status=201,
        )


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
                    order = Order.objects.get(id=idorder)
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
                    metadata={"order_id": order.id},
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
                order = Order.objects.get(id=idorder)
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
        user = request.user
        if user.role != "collector":
            return Response(
                {"error": "No puedes acceder a esta funcion sin ssr un recolector"},
                status=400,
            )
        collector = user.collectorprofile
        if collector.has_active_route:
            return Response({"error": "Tienes una ruta activa"}, status=400)
        lat = float(request.GET.get("lat"))
        lon = float(request.GET.get("lon"))

        print("xd", lat, lon)
        if not lat or not lon:
            return Response({"error": "No hay suficientes datos"}, status=400)
        radio = 1  # valor por defecto: 1 km

        orders = get_nearby_orders(lat, lon, radio)

        return JsonResponse({"orders": orders}, status=200)


class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer
    permission_classes = [IsAuthenticated]


class UpdateVehicleView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = request.user

        # Verifica si el usuario es un recolector
        if user.role != "collector":
            return Response(
                {"detail": "No autorizado"}, status=status.HTTP_403_FORBIDDEN
            )

        id = request.data.get("id")
        if not id:
            return Response(
                {"error": "Falta el tipo de vehículo"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            nuevo_vehiculo = Vehicle.objects.get(id=id)
        except Vehicle.DoesNotExist:
            print("hols")
            return Response(
                {"error": "Tipo de vehículo no válido"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        collector = user.collectorprofile
        print(collector)
        collector.vehicle = nuevo_vehiculo
        collector.save()
        vehicle = VehicleSerializer(collector.vehicle).data
        return Response({"vechicle": vehicle}, status=status.HTTP_200_OK)


class VehicleViewSet(viewsets.ModelViewSet):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [IsAuthenticated]


class ShowCurrentOrder(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        id_order = request.data.get("id")
        if not user:
            return Response({"error": "No hay usuario"}, status=400)


class CalcularRutaOrdenView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        lat1 = request.data.get("lat")
        lon1 = request.data.get("lon")
        order_id = request.data.get("id")
        print(lon1, lat1, order_id)
        if not (lat1 and lon1 and order_id):
            return Response({"error": "Datos incompletos"}, status=400)

        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            return Response({"error": "Orden no encontrada"}, status=404)

        punto_inicio = (float(lat1), float(lon1))
        punto_final = (float(order.lat), float(order.lon))
        ruta_data = obtener_ruta_osrm([punto_inicio, punto_final])
        instrucciones = generar_instrucciones(ruta_data)

        return Response(
            {
                "ruta": ruta_data,
                "instrucciones": instrucciones,
                "lat": order.lat,
                "lon": order.lon,
            }
        )


# OBTENER RUTA DE LA API
@csrf_exempt
def obtener_ruta_osrm(puntos):
    """Obtiene la ruta usando OSRM y devuelve la geometría."""
    url = "http://router.project-osrm.org/route/v1/driving/"
    coordinates = ";".join([f"{lon},{lat}" for lat, lon in puntos])
    url += f"{coordinates}?overview=full&geometries=polyline&steps=true"

    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": "No se pudo obtener la ruta"}


# CALCULAR DITANCIA
@csrf_exempt
def calcular_distancia(punto1, punto2):
    """Calcula la distancia entre dos puntos usando OSRM."""
    url = f"http://router.project-osrm.org/table/v1/driving/{punto1[1]},{punto1[0]};{punto2[1]},{punto2[0]}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        print(data)
        return data["durations"][0][1]
    return float("inf")


def precalcular_distancias(puntos):
    """Obtiene una matriz de distancias entre todos los puntos."""
    url = "http://router.project-osrm.org/table/v1/driving/"
    coordinates = ";".join([f"{lon},{lat}" for lat, lon in puntos])
    response = requests.get(f"{url}{coordinates}")

    if response.status_code == 200:
        data = response.json()
        return data["durations"]
    else:
        return None


def tsp_greedy_matriz(punto_inicio, puntos, matriz):
    """Resuelve el TSP usando la matriz de distancias precalculada."""
    unvisited = list(
        range(1, len(puntos))
    )  # Índices de puntos sin visitar (excepto el inicio)
    ruta = [0]  # Índice del punto de inicio
    current_index = 0

    while unvisited:
        next_index = min(unvisited, key=lambda i: matriz[current_index][i])
        ruta.append(next_index)
        unvisited.remove(next_index)
        current_index = next_index

    ruta.append(0)  # Regresa al punto de inicio
    return [puntos[i] for i in ruta]


@csrf_exempt
def recoleccion_rutas(request):
    """Vista para calcular y devolver la ruta optimizada."""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            print(data)
            punto_inicio = data.get("inicio")
            puntos_seleccionados = data.get("puntos", [])
            if not punto_inicio or not puntos_seleccionados:
                return JsonResponse({"error": "Faltan puntos necesarios"}, status=400)

            puntos = [(punto_inicio["lat"], punto_inicio["lon"])] + [
                (p["lat"], p["lon"]) for p in puntos_seleccionados
            ]
            matriz = precalcular_distancias(puntos)
            if matriz is None:
                return JsonResponse(
                    {"error": "No se pudo calcular la matriz de distancias"}, status=400
                )

            # Resolver el TSP
            ruta_optima = tsp_greedy_matriz(puntos[0], puntos, matriz)

            # Obtener la ruta usando OSRM
            ruta = obtener_ruta_osrm(ruta_optima)

            instrucciones = generar_instrucciones(ruta)
            for instruccion in instrucciones:
                print(instruccion)
            # Devolver la ruta y las instrucciones
            return JsonResponse(
                {
                    "ruta": ruta,
                    "instrucciones": instrucciones,
                }
            )

        except json.JSONDecodeError:
            return JsonResponse({"error": "JSON malformado"}, status=400)

    return JsonResponse({"error": "Método no permitido"}, status=405)


# Ejemplo de los 'steps' extraídos de la API


# Función para generar instrucciones paso a paso
def generar_instrucciones(ruta):
    steps = ruta["routes"][0]["legs"][0]["steps"]
    instrucciones = []
    print(ruta)
    print(steps)
    for step in steps:
        # Verifica si las claves existen y asigna valores predeterminados claros
        maniobra = step["maneuver"].get(
            "modifier", "continúa recto"
        )  # Valor predeterminado
        calle = step.get("name", "una calle desconocida")  # Valor predeterminado
        distancia = step.get("distance", 0)  # En metros

        # Traduce los modifiers a instrucciones claras
        if maniobra == "right":
            maniobra = "Gira a la derecha"
        elif maniobra == "left":
            maniobra = "Gira a la izquierda"
        elif maniobra == "straight":
            maniobra = "Continúa recto"
        elif maniobra == "uturn":
            maniobra = "Haz un cambio de sentido"
        elif maniobra == "sharp right":
            maniobra = "Gira pronunciadamente a la derecha"
        elif maniobra == "sharp left":
            maniobra = "Gira pronunciadamente a la izquierda"
        else:
            maniobra = (
                f"{maniobra.capitalize()}"  # Si no es conocido, se deja como está
            )

        # Redondea la distancia a dos decimales si es válida
        if distancia > 0:
            distancia = round(distancia, 2)
            instruccion = f"{maniobra} en {calle}, continúa durante {distancia} metros."
        else:
            instruccion = f"{maniobra} en {calle}."

        instrucciones.append(instruccion)

        # Si encuentra la instrucción "arrive", asegura que agregue la vuelta al inicio
        if "arrive" in step.get("type", ""):
            instrucciones.append("Has llegado al punto final de la ruta.")
            instrucciones.append(
                "Regresa al punto inicial."
            )  # Esta instrucción asegura el regreso

            # Si deseas que la última instrucción sea más clara y concluir la ruta
            break  # Esto hace que el ciclo termine una vez que se procesan las instrucciones de llegada

    return instrucciones


# Generar e imprimir las instrucciones


@csrf_exempt
def guardar_ruta(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            geometry = data.get("geometry")
            inicio = data.get("inicio")
            puntos = data.get("puntos")
            print(data)
            if not geometry:
                return JsonResponse({"error": "La geometría es requerida."}, status=400)

            Route.objects.create(geometry=geometry, inicio=inicio, puntos=puntos)
            return JsonResponse({"message": "Ruta guardada exitosamente."})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)


from django.http import JsonResponse
from django.utils.timezone import now
from routes.models import Route
import random


def ver_rutas(request):
    # Obtener la fecha de hoy
    hoy = now().date()

    # Filtrar rutas que fueron creadas hoy
    rutas = Route.objects.filter(fecha_creacion__date=hoy).values(
        "id", "geometry", "inicio", "puntos", "fecha_creacion"
    )

    # Función para asignar colores aleatorios
    def generar_color_unico():
        colores = ["red", "green", "blue", "purple", "orange", "pink", "yellow"]
        return random.choice(colores)

    # Agregar colores a las rutas
    rutas_data = []
    for ruta in rutas:
        ruta_data = dict(ruta)
        ruta_data["color"] = generar_color_unico()  # Asignar un color aleatorio
        rutas_data.append(ruta_data)

    return JsonResponse({"rutas": rutas_data})


@csrf_exempt
def borrar_ruta(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            ruta_id = data.get("id")
            Route.objects.filter(id=ruta_id).delete()
            return JsonResponse({"message": "Ruta eliminada"})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)


from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Order
from routes.models import Route


class CancelOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if user.role != "collector":
            return Response(
                {"error": "No tienes permiso para cancelar una orden."},
                status=status.HTTP_403_FORBIDDEN,
            )

        order_id = request.data.get("id")
        print(order_id)

        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            print("aaa")
            return Response({"error": "Orden no encontrada."}, status=400)

        if order.status != "accepted":
            return Response(
                {"error": "Solo puedes cancelar órdenes activas."},
                status=400,
            )
        try:
            route = Route.objects.get(order=order)
        except ObjectDoesNotExist:
            return Response(
                {"error": "no hay ruta."},
                status=400,
            )
        route.delete()
        # Actualizar el estado de la orden
        order.status = "ontheway"
        order.id_collector = None
        order.save()

        # Marcar que el recolector ya no tiene ruta activa
        collector = user.collectorprofile
        collector.has_active_route = False
        collector.save()

        return Response({"message": "Orden cancelada y ruta eliminada."}, status=200)


class CompleteOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        order_id = request.data.get("order_id")

        if not order_id:
            return Response({"error": "Falta el ID de la orden"}, status=400)

        try:
            route = Route.objects.get(order_id=order_id)

            # Marcar la ruta como completada

            # Marcar también la orden como completada
            order = route.order
            order.status = (
                "completed"  # Asegúrate de que este estado exista en tu modelo
            )
            order.save()

            return Response({"message": "Orden completada con éxito"}, status=200)

        except Route.DoesNotExist:
            return Response(
                {"error": "Ruta no encontrada o no asignada a este recolector"},
                status=404,
            )
        except Exception as e:
            return Response({"error": str(e)}, status=500)
