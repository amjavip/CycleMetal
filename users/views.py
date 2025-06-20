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

"""

from rest_framework import viewsets
from datetime import timedelta
from .models import Seller, Collector
from .serializer import SellerSerializer, CollectorSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from .serializer import SellerSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken, TokenError
from django.core.mail import send_mail
from django.contrib.auth.models import User
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError, ObjectDoesNotExist

# TODO falta que el usuario no pueda recibir la contraseña que inicie con "pbkdf2_sha256$
"""posibles soluciones:
    1.-validar si la contraseña viene con esto si es el caso rechazar
    2.-hacer un make_password desde antes y ya que solo por seguridad llega sin hasear a la base de datos ahi se actualiza
"""


# Esta solucion es momentanea y se puede mejorar en un futuro
def validate_password(newpassword):
    if newpassword.startswith("pbkdf2_sha256$"):
        raise ValidationError("La contraseña no puede comenzar con 'pbkdf2_sha256$'.")
    return newpassword


class RegisterUserView(APIView):
    """Registro del usuario
    \n
    Para manejar el registro del usuario de usa una clase la cual puede
    almacenar fucnciones y de esta manera generar funciones avanzadas
    y mas faciles de escalar
    """

    # esta funcion hace una petición POST
    def post(self, request):
        role = request.data.get(
            "role"
        )  # por medio de una peticion get se obtiene la informacion del rol

        if role == "seller":

            serializer = SellerSerializer(data=request.data)
            print(serializer)
            print(request.data)  # Verificacion en la terminar (solo para desarrollo)
            """Si el rol es de vendedor se llama el 
            serializadordel collector y guarda en una
            variable la cual llamaremos serializer"""

        elif role == "collector":

            serializer = CollectorSerializer(data=request.data)

            print(request.data)  # Verificacion en la terminar (solo para desarrollo)

            """Si el rol es de recolector se llama el 
            serializador del collector y guarda en una
            variable la cual llamaremos serializer"""

        else:
            return Response(
                {"error": "Role must be either 'seller' or 'collector'"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        """De cualquier otro modo se manda una 
        respuesta explicando que no se detecto 
        el rol en el formulario"""

        if serializer.is_valid():  # Se comprueba que el serializador sea válido

            user = serializer.save()
            """El serializador guardado se guarda en una variable user"""

            return Response(
                {
                    "message": f"User registered as {role} successfully",
                },
                status=status.HTTP_201_CREATED,
            )
            """Se devuelve un status de la operacion la cual confirma si
            el usuario ha sido guardado en la base datos exitosamente o 
            de lo contrario no"""

        else:

            print("Errores de validación:", serializer.errors)
            """imprime los valores de validacion detectados por el serializador"""

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])  # Esta Vista(funcion) solo recibe peticiones del tipo POST
def check_username(request):
    """Dentro de esta vista se verifica la disponibilidad
    en la base de datos, esto para mantener la integridad
    de los datos y mantener datos unicos.
    """
    username = request.data.get("username")
    email = request.data.get("email")
    """Se declaran las variables por medio de una peticion get al cuestionario de registro"""
    # Verificar si el nombre de usuario ya existe en los modelos Seller o Collector
    if (
        Seller.objects.filter(sellerUsername=username).exists()
        or Collector.objects.filter(collectorUsername=username).exists()
    ):
        return Response({"exists": True})

    # Verificar si el email ya existe en los modelos Seller o Collector
    if (
        Seller.objects.filter(sellerEmail=email).exists()
        or Collector.objects.filter(collectorEmail=email).exists()
    ):
        return Response({"exists": True})

    return Response({"exists": False})


class SellerViewSet(viewsets.ModelViewSet):
    queryset = Seller.objects.all()
    serializer_class = SellerSerializer
    permission_classes = [IsAuthenticated]


class CollectorViewSet(viewsets.ModelViewSet):
    queryset = Collector.objects.all()
    serializer_class = CollectorSerializer
    permission_classes = [IsAuthenticated]


# TODO falta verificar la disponibilidad del usuario en la DB con def check_username
class UpdateUserView(APIView):
    def put(self, request):
        user_id = request.data.get("id")
        role = request.data.get("role")
        user = None

        if role == "Seller":
            user = Seller.objects.filter(id_seller=user_id).first()
        elif role == "Collector":
            user = Collector.objects.filter(id_collector=user_id).first()

        if user:
            serializer = SellerSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()

                # Regenerar el token después de actualizar los datos
                refresh = RefreshToken.for_user(user)

                return Response(
                    {
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                        "id": user.id_seller if role == "Seller" else user.id_collector,
                        "username": (
                            user.sellerUsername
                            if role == "Seller"
                            else user.collectorUsername
                        ),
                        "email": (
                            user.sellerEmail
                            if role == "Seller"
                            else user.collectorEmail
                        ),
                        "phone": (
                            user.sellerPhone
                            if role == "Seller"
                            else user.collectorPhone
                        ),
                        "role": role,
                    }
                )

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


class LoginView(APIView):
    def post(self, request):
        username_or_email = request.data.get("usernameOrEmail")
        password = request.data.get("password")

        user = None
        role = None

        # Buscar en Sellers
        seller = (
            Seller.objects.filter(sellerUsername=username_or_email).first()
            or Seller.objects.filter(sellerEmail=username_or_email).first()
        )
        if seller and check_password(password, seller.sellerpassword):

            user = seller
            role = "Seller"

        # Buscar en Collectors si no se encontró en Sellers
        if not user:
            collector = (
                Collector.objects.filter(collectorUsername=username_or_email).first()
                or Collector.objects.filter(collectorEmail=username_or_email).first()
            )
            if collector and check_password(password, collector.collectorpassword):

                user = collector
                role = "Collector"
            else:
                return Response(
                    {"error": "Credenciales incorrectas"},
                    status=status.HTTP_401_UNAUTHORIZED,
                )

        # Si el usuario es válido, generar tokens
        if user:
            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "id": user.id_seller if role == "Seller" else user.id_collector,
                    "username": (
                        user.sellerUsername
                        if role == "Seller"
                        else user.collectorUsername
                    ),
                    "email": (
                        user.sellerEmail if role == "Seller" else user.collectorEmail
                    ),
                    "phone": (
                        user.sellerPhone if role == "Seller" else user.collectorPhone
                    ),
                    "role": role,
                },
                status=status.HTTP_200_OK,
            )

        return Response(
            {"error": "Credenciales incorrectas"}, status=status.HTTP_401_UNAUTHORIZED
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
    if role == "Seller":
        user = Seller.objects.filter(id_seller=user_id).first()
        print(user)
        if not user:
            return Response({"error": "Usuario no encontrado"}, status=404)
        if check_password(new_password, user.sellerpassword):
            print("no puede ser iguales las contraseñas")
            return True
        else:
            user.sellerpassword = make_password(new_password)
            user.save()
            print("contraseña guardada")
            return False
    elif role == "Collector":
        user = Collector.objects.filter(id_collector=user_id).first()
        if not user:
            return Response({"error": "Usuario no encontrado"}, status=404)
        if check_password(new_password, user.collectorpassword):
            print("collector")
            return Response(
                {"error": "La nueva contraseña no puede ser igual a la anterior"},
                status=422,
            )
        else:
            user.collectorpassword = make_password(new_password)
            user.save()
    else:
        return Response({"error": "Rol inválido"}, status=400)


class no_data:
    def no_rol(email):
        user = Seller.objects.filter(sellerEmail=email).first()
        if not user:
            user = Collector.objects.filter(collectorEmail=email).first()
            if user:
                role = "Collector"

                return role
            else:
                print("algo paso")
                return Response(
                    {"error": "No se detectno ningun usuario"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        elif user:
            role = "Seller"
            return role
        else:
            return Response(
                {"error": "No se detectno ningun email"},
                status=status.HTTP_400_BAD_REQUEST,
            )

    def no_id(email):
        seller = Seller.objects.filter(sellerEmail=email).first()
        if not seller:
            collector = Collector.objects.filter(collectorEmail=email).first()
            if collector:
                return collector.id
            else:
                return Response(
                    {"error": "No se detectno ningun usuario"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        elif seller:
            return seller.id
        else:
            return Response(
                {"error": "No se detectno ningun email"},
                status=status.HTTP_400_BAD_REQUEST,
            )


@api_view(["POST"])  # Esta Vista(funcion) solo recibe peticiones del tipo POST
def check_pass(request):
    role = request.data.get("role")
    user_id = request.data.get("id")
    password = request.data.get("password")
    if not role or not password:
        return Response(
            {"error": "se necesitan toods los campos"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    elif role == "Seller":
        user = Seller.objects.get(id_seller=user_id)
        if check_password(password, user.sellerpassword):
            reset_url, token, uid = generate_reset_url(user)
            return Response({"url": reset_url, "token": token, "uid": uid}, status=200)
        else:
            return Response({"error": "Contraseña incorrecta"}, status=400)

    elif role == "Collector":
        user = Collector.objects.get(id_collector=user_id)
        if check_password(password, user.collectorpassword):
            reset_url, token = generate_reset_url(user)
            return Response({"url": reset_url, "token": token}, status=200)
        else:
            return Response({"error": "Contraseña incorrecta"}, status=400)

    else:
        return Response(
            {"error": "No se detectno ningun usuario"},
            status=status.HTTP_400_BAD_REQUEST,
        )


class SendResetEmailView(APIView):
    def post(self, request):
        role = request.data.get("role")
        email = request.data.get("email")
        if not email:
            return Response(
                {"error": "Email y Rol requeridos"}, status=status.HTTP_400_BAD_REQUEST
            )
        if not role:
            role = no_data.no_rol(email)
        if role:
            if role == "Seller":
                user = Seller.objects.get(sellerEmail=email)
            elif role == "Collector":
                user = Collector.objects.get(collectorEmail=email)
            else:
                return Response({"error": "Rol no reconocido"}, status=400)
        else:
            return Response({"error": "No existe un usuario "}, status=404)
        reset_url, token, uid = generate_reset_url(user)

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
            role = no_data.no_rol(email)
        if not user_id:
            user_id = no_data.no_id(email)
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
