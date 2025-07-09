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

from collection.models import Order
from .models import Route

# Create your views here.
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class ActiveRouteView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role != "collector":
            return Response(
                {"error": "Acceso denegado, no eres recolector"},
                status=status.HTTP_403_FORBIDDEN,
            )

        collector = user.collectorprofile

        if not collector.has_active_route:
            return Response({"active_route": False}, status=200)

        # Obtener la orden con ruta activa
        try:
            order = Order.objects.get(id_collector=user, status="accepted")
        except Order.DoesNotExist:
            # Por si el flag no está sincronizado con la base
            collector.has_active_route = False
            collector.save()
            return Response({"active_route": False}, status=200)

        # Obtener la ruta asociada a esa orden
        try:
            route = Route.objects.get(order=order)
            print(order)
        except Route.DoesNotExist:
            return Response(
                {"error": "No se encontró la ruta para la orden activa"}, status=404
            )

        # Serializa los datos que necesites enviar
        data = {
            "active_route": collector.has_active_route,
            "order_id": str(order.id),
            "route_id": str(route.id),
            "start_lat": route.lat,
            "start_lon": route.lon,
            "end_lat": route.endlat,
            "end_lon": route.endlon,
            "routeDistance": route.routeDistance,
            "routeGeometry": route.routeGeometry,
            "order_status": order.status,
        }
        return Response(data, status=200)
