"""
Autor: Javier -amjavip

Notas:

Recuerda que puedes encontrar informacion mas resumida en la documentacion del proyecto
puedes encontrarla en http://127.0.0.1:8000/users/api/docs/ esta la encontraras al momento
de iniciar el servidor del backend.

Si estas usando una version de python igual o superior a la 3.12 es importante que algunas
librerias no estan disponibles debido a que se consideran obsoletas, para evitar estos problemas
de recomienda usar la version 3.10 ya que con esta versiona sido desarrollado este programa.

Para cualquier aclaracion especifica visita la documentacion de django consultala en este link
https://www.django-rest-framework.org/

Module: users.views
Funcion: CRUD de los usuario, validacion en la autentifacion de los usuarios y mostrar estadisticas y controlar el flujo en general de las funciones que tiene que ver con los usuarios
"""

from rest_framework import viewsets, status
from datetime import timedelta, datetime
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth.hashers import check_password, make_password
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken, TokenError
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.exceptions import ValidationError
from collection.serializer import VehicleSerializer
from .models import User, SellerProfile, CollectorProfile
from collection.models import Order
from .serializer import (
    SellerProfileSerializer,
    CollectorProfileSerializer,
    UserSerializer,
)


# TODO falta que el usuario no pueda recibir la contraseña que inicie con "pbkdf2_sha256$"
"""posibles soluciones:
    1.-validar si la contraseña viene con esto si es el caso rechazar
    2.-hacer un make_password desde antes y ya que solo por seguridad llega sin hasear a la base de datos ahi se actualiza
"""


# Esta solucion es momentanea y se puede mejorar en un futuro
def validate_password(newpassword):
    if not newpassword:
        raise ValidationError("La contraseña no puede estar vacía.")
    if newpassword.startswith("pbkdf2_sha256$"):
        raise ValidationError("La contraseña no puede comenzar con 'pbkdf2_sha256$'.")
    return newpassword


class no_data:
    def no_rol(email):
        user = User.objects.filter(email=email).first()
        if user:
            return user.role
        else:
            return Response(
                {"error": "No se detectó ningún usuario con ese email"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def no_id(email):
        user = User.objects.filter(email=email).first()
        if user:
            return user.id
        else:
            return Response(
                {"error": "No se detectó ningún usuario con ese email"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class RegisterUserView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        role = request.data.get("role")

        if role not in ["seller", "collector"]:
            return Response(
                {"error": "Role must be either 'seller' or 'collector'"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        # Crear usuario base
        user_serializer = UserSerializer(data=request.data)
        if user_serializer.is_valid():
            user = user_serializer.save()

            return Response(
                {"message": f"User registered as {role} successfully"},
                status=status.HTTP_201_CREATED,
            )
        else:
            return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])  # Esta Vista(funcion) solo recibe peticiones del tipo POST
@permission_classes([AllowAny])
def check_username(request):
    print("request:", request)
    print("data:", request.data)
    """Dentro de esta vista se verifica la disponibilidad
    en la base de datos, esto para mantener la integridad
    de los datos y mantener datos unicos.
    """
    username = request.data.get("username")
    email = request.data.get("email")
    """Se declaran las variables por medio de una peticion get al cuestionario de registro"""
    # Verificar si el nombre de usuario o email ya existe en el modelo User
    print(username, email)
    if username_or_email_exists(username, email):
        return Response({"exists": True})

    return Response({"exists": False})


def username_or_email_exists(username, email):
    return (
        User.objects.filter(username=username).exists()
        or User.objects.filter(email=email).exists()
    )


class UpdateUserView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user_id = request.data.get("id")
        role = request.data.get("role")
        username = request.data.get("username")
        email = request.data.get("email")
        print(request.data.get("username"))

        try:
            user = User.objects.get(id=user_id, role=role)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )
        print(user.username)
        if username != user.username and email != user.email:
            if username_or_email_exists(username, email):
                print("el nombre de usuario o email ya existe")
            return Response(
                {"error": "El nombre de usuario o email ya existe"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if role == "seller" or role == "collector":

            serializer = UserSerializer(user, data=request.data, partial=True)

        else:
            return Response(
                {"error": "Invalid role"}, status=status.HTTP_400_BAD_REQUEST
            )

        print(serializer)
        if serializer.is_valid():

            serializer.save()

            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token
            access_token["role"] = role
            access_token["user_id"] = str(user.id)
            if user.role == "collector":
                collector = user.collectorprofile
                vehicle_data = None  # Aseguras que existe la variable
                if collector.vehicle:
                    vehicle_data = VehicleSerializer(collector.vehicle).data
                    print("hello", collector.has_active_route)

                return Response(
                    {
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                        "id": str(user.id),
                        "username": user.username,
                        "email": user.email,
                        "phone": user.phone,
                        "role": user.role,
                        "vehicle": vehicle_data,
                        "has_active_route": collector.has_active_route,
                    },
                    status=status.HTTP_200_OK,
                )

            return Response(
                {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "id": str(user.id),
                    "username": user.username,
                    "email": user.email,
                    "phone": user.phone,
                    "role": role,
                },
                status=status.HTTP_200_OK,
            )
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username_or_email = request.data.get("usernameOrEmail")
        password = request.data.get("password")

        user = None

        # Buscar usuario por username
        try:
            user = User.objects.get(username=username_or_email)
        except User.DoesNotExist:
            # Si no existe, buscar por email
            try:
                user = User.objects.get(email=username_or_email)
            except User.DoesNotExist:
                return Response(
                    {"error": "Credenciales incorrectas"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

        # Validar contraseña
        if not check_password(password, user.password):
            return Response(
                {"error": "Credenciales incorrectas"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # Si el usuario es válido, generar tokens
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        access_token["role"] = user.role
        access_token["user_id"] = str(user.id)
        if user.role == "collector":
            collector = user.collectorprofile
            vehicle_data = None

            if collector.vehicle:
                vehicle_data = VehicleSerializer(collector.vehicle).data

            collector.has_active_route  # Solo asigna booleano, sin serializar

            return Response(
                {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "id": str(user.id),
                    "username": user.username,
                    "email": user.email,
                    "phone": user.phone,
                    "role": user.role,
                    "vehicle": vehicle_data,
                    "has_active_route": collector.has_active_route,
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "id": str(user.id),
                "username": user.username,
                "email": user.email,
                "phone": user.phone,
                "role": user.role,
            },
            status=status.HTTP_200_OK,
        )


def generate_temporaly_token(user):
    token = AccessToken.for_user(user)
    token.set_exp(lifetime=timedelta(minutes=15))
    return token


def generate_reset_url(user):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = generate_temporaly_token(user)
    return f"/changepassword/{uid}/{token}/", str(token), str(uid)


def change_password(role, user_id, new_password):
    print("Nueva contraseña:", repr(new_password))
    print("role:", role)
    try:
        user = User.objects.get(id=user_id, role=role)
    except User.DoesNotExist:
        return Response({"error": "Usuario no encontrado"}, status=404)

    if check_password(new_password, user.password):
        print("no puede ser iguales las contraseñas")
        return True  # La nueva contraseña es igual a la antigua

    user.password = make_password(new_password)
    user.save()

    return False


@api_view(["POST"])  # Esta Vista(funcion) solo recibe peticiones del tipo POST
@permission_classes([AllowAny])
def check_pass(request):
    role = request.data.get("role")
    user_id = request.data.get("id")
    password = request.data.get("password")
    if not role or not password:
        return Response(
            {"error": "se necesitan toods los campos"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        user = User.objects.get(id=user_id, role=role)
    except User.DoesNotExist:
        return Response(
            {"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND
        )

    if check_password(password, user.password):
        reset_url, token, uid = generate_reset_url(user)
        return Response({"url": reset_url, "token": token, "uid": uid}, status=200)
    else:
        return Response({"error": "Contraseña incorrecta"}, status=400)


class SendResetEmailView(APIView):
    def post(self, request):
        role = request.data.get("role")
        email = request.data.get("email")

        if not email:
            return Response(
                {"error": "Email y Rol requeridos"}, status=status.HTTP_400_BAD_REQUEST
            )

        if not role:
            # Si no hay rol, buscarlo por email
            try:
                user = User.objects.get(email=email)
                role = user.role
            except User.DoesNotExist:
                return Response(
                    {"error": "No existe un usuario con ese email"},
                    status=status.HTTP_404_NOT_FOUND,
                )
        else:
            try:
                user = User.objects.get(email=email, role=role)
            except User.DoesNotExist:
                return Response(
                    {"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND
                )

        reset_url, token, uid = generate_reset_url(user)
        """cambiar el link de recuperacion de aca abajo pq no funciona si no estamos en local host
        
        """
        send_mail(
            "Restablece tu contraseña",
            f"Haz clic en el siguiente enlace para cambiar tu contraseña:\n\nhttp://localhost:5173{reset_url}",
            None,
            [email],
            fail_silently=False,
        )

        return Response(
            {
                "message": "Correo enviado correctamente",
                "url": reset_url,
                "t_token": token,
                "uid": uid,
            },
            status=200,
        )


class ChangePasswordView(APIView):
    def post(self, request):
        new_password = request.data.get("new_password")
        email = request.data.get("email")
        user_id = request.data.get("id")
        role = request.data.get("role")
        token = request.data.get("t_token")

        if not role:
            try:
                user = User.objects.get(email=email)
                role = user.role
            except User.DoesNotExist:
                return Response(
                    {"error": "No existe un usuario con ese email"},
                    status=status.HTTP_404_NOT_FOUND,
                )

        if not user_id:
            try:
                user = User.objects.get(email=email)
                user_id = str(user.id)
            except User.DoesNotExist:
                return Response(
                    {"error": "No existe un usuario con ese email"},
                    status=status.HTTP_404_NOT_FOUND,
                )

        if not all([new_password, token, user_id, role]):
            print(token)
            return Response({"error": "Todos los campos son requeridos"}, status=400)

        try:
            AccessToken(token)  # valida expiración
        except TokenError:
            return Response(
                {"error": "El acceso ha expirado, solicita otro enlace"}, status=400
            )

        try:
            validate_password(new_password)
        except ValidationError as e:
            return Response({"error": str(e)}, status=400)

        res = change_password(role, user_id, new_password)
        if res:
            return Response(
                {"error": "La contraseña no puede ser igual a la antigua"}, status=400
            )
        else:
            return Response(
                {"message": "Contraseña actualizada correctamente"}, status=200
            )


class SellerViewSet(viewsets.ModelViewSet):
    queryset = SellerProfile.objects.all()
    serializer_class = SellerProfileSerializer
    permission_classes = [AllowAny]


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class CollectorViewSet(viewsets.ModelViewSet):
    queryset = CollectorProfile.objects.all()
    serializer_class = CollectorProfileSerializer
    permission_classes = [IsAuthenticated]


class SellerWeeklyActivity(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role == "collector":
            return Response(
                {"error": "Solo recolectores pueden ver esta info"}, status=403
            )

        # Obtener sus órdenes completadas
        orders = Order.objects.filter(id_seller=user.id, status="completed")

        dias = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
        resumen = {d: 0 for d in dias}

        for order in orders:
            dia = order.orderCreationDay.strftime("%a")
            dia_spanish = {
                "Mon": "Lun",
                "Tue": "Mar",
                "Wed": "Mié",
                "Thu": "Jue",
                "Fri": "Vie",
                "Sat": "Sáb",
                "Sun": "Dom",
            }.get(dia, "")
            if dia_spanish:
                resumen[dia_spanish] += 1  # ✅ Contamos 1 orden, no peso

        data = [{"name": dia, "pedidos": resumen[dia]} for dia in dias]
        return Response(data)


class CollectorStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role != "collector":
            return Response({"error": "No autorizado"}, status=403)

        hoy = datetime.now()
        inicio_semana = hoy - timedelta(days=hoy.weekday())  # lunes de esta semana

        # Filtrar pedidos asignados al recolector y creados esta semana
        pedidos_semana = Order.objects.filter(
            id_collector=user, orderCreationDay__date__gte=inicio_semana.date()
        )

        # Contar pedidos completados
        completados = pedidos_semana.filter(status="completed").count()

        # Contar órdenes aceptadas (ya no pendientes)
        aceptados = pedidos_semana.filter(status="acepted").count()
        print(aceptados)
        # Sumar propinas (sin usar Sum)
        propinas = sum(
            [float(p.tip) for p in pedidos_semana if p.status == "completed"]
        )

        # Determinar el día más activo
        dias = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
        conteo_por_dia = [0] * 7
        for orden in pedidos_semana:
            dia_index = orden.orderCreationDay.weekday()
            conteo_por_dia[dia_index] += 1
        dia_mas_activo = (
            dias[conteo_por_dia.index(max(conteo_por_dia))] if pedidos_semana else "N/A"
        )

        return Response(
            {
                "completados": completados,
                "aceptados": aceptados,
                "propinas": round(propinas, 2),
                "dia_mas_activo": dia_mas_activo,
            }
        )
