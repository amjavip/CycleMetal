'''
Autor: Javier -amjavip

Notas:

Recuerda que puedes encontrar informacion mas resumida en la documentacion del proyecto
puedes encontrarla en http://127.0.0.1:8000/users/api/docs/ esta la encontraras al momento
de iniciar el servidor del backend.

Si estas usando una version de python igual o superior a la 3.12 es importante que algunas
librerias no estan disponibles debido a que se consideran obsoletas, para evitar estos problemas
de recomienda usar la version 3.10 ya que con esta versionha sido desarrollado este programa.

Para cualquier aclaracion especifica visita la documentacion de django consultala en este link
https://www.django-rest-framework.org/

'''
from rest_framework import viewsets
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
from rest_framework_simplejwt.tokens import RefreshToken



class RegisterUserView(APIView):
    
    """Registro del usuario
    
    Para manejar el registro del usuario de usa una clase la cual puede
    almacenar fucnciones y de esta manera generar funciones avanzadas
    y mas faciles de escalar
    """
    #esta funcion hace una petición POST
    def post(self, request):
        role = request.data.get('role') #por medio de una peticion get se obtiene la informacion del rol
        
        if role == 'seller':
            
            serializer = SellerSerializer(data=request.data)
            print(request.data) #Verificacion en la terminar (solo para desarrollo)
            """Si el rol es de vendedor se llama el 
            serializadordel collector y guarda en una
            variable la cual llamaremos serializer"""
            
        elif role == 'collector':
            
            serializer = CollectorSerializer(data=request.data)
            
            print(request.data) #Verificacion en la terminar (solo para desarrollo)
            
            """Si el rol es de recolector se llama el 
            serializador del collector y guarda en una
            variable la cual llamaremos serializer"""
            
        else:
            return Response({"error": "Role must be either 'seller' or 'collector'"}, status=status.HTTP_400_BAD_REQUEST)
        """De cualquier otro modo se manda una 
        respuesta explicando que no se detecto 
        el rol en el formulario"""

        if serializer.is_valid(): # Se comprueba que el serializador sea válido
            
            user = serializer.save()
            """El serializador guardado se guarda en una variable user"""
            
            return Response({
                "message": f"User registered as {role} successfully",
                
            }, status=status.HTTP_201_CREATED)
            """Se devuelve un status de la operacion la cual confirma si
            el usuario ha sido guardado en la base datos exitosamente o 
            de lo contrario no"""
            
        else:
            
            print("Errores de validación:", serializer.errors) 
            """imprime los valores de validacion detectados por el serializador"""
             
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




@api_view(['POST']) #Esta Vista(funcion) solo recibe peticiones del tipo POST
def check_username(request):
    """Dentro de esta vista se verifica la disponibilidad 
    en la base de datos, esto para mantener la integridad
    de los datos y mantener datos unicos.
    """
    username = request.data.get('username')
    email = request.data.get('email')
    """Se declaran las variables por medio de una peticion get al cuestionario de registro"""
    # Verificar si el nombre de usuario ya existe en los modelos Seller o Collector
    if Seller.objects.filter(sellerUsername=username).exists() or Collector.objects.filter(collectorUsername=username).exists():
        return Response({'exists': True})
    
    # Verificar si el email ya existe en los modelos Seller o Collector
    if Seller.objects.filter(sellerEmail=email).exists() or Collector.objects.filter(collectorEmail=email).exists():
        return Response({'exists': True})
    
    return Response({'exists': False})

class SellerViewSet(viewsets.ModelViewSet):
    queryset = Seller.objects.all()
    serializer_class = SellerSerializer
    permission_classes = [IsAuthenticated]

  
class CollectorViewSet(viewsets.ModelViewSet):
    queryset = Collector.objects.all()
    serializer_class = CollectorSerializer
    permission_classes = [IsAuthenticated] 
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Seller, Collector
from .serializer import SellerSerializer, CollectorSerializer

from rest_framework_simplejwt.tokens import RefreshToken

class UpdateUserView(APIView):
    def put(self, request):
        user_id = request.data.get('id')
        role = request.data.get('role')
        user = None

        if role == 'Seller':
            user = Seller.objects.filter(id_seller=user_id).first()
        elif role == 'Collector':
            user = Collector.objects.filter(id_collector=user_id).first()

        if user:
            serializer = SellerSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()

                # Regenerar el token después de actualizar los datos
                refresh = RefreshToken.for_user(user)
               

                return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "id": user.id_seller if role == "Seller" else user.id_collector,
                "username": user.sellerUsername if role == "Seller" else user.collectorUsername,
                "email": user.sellerEmail if role == "Seller" else user.collectorEmail,
                "phone": user.sellerPhone if role == "Seller" else user.collectorPhone,
                "role": role
                })

            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

class LoginView(APIView):
    def post(self, request):
        username_or_email = request.data.get("usernameOrEmail")
        password = request.data.get("password")

        user = None
        role = None

        # Buscar en Sellers
        seller = Seller.objects.filter(sellerUsername=username_or_email).first() or Seller.objects.filter(sellerEmail=username_or_email).first()
        if seller and check_password(password, seller.sellerpassword):
            user = seller
            role = "Seller"

        # Buscar en Collectors si no se encontró en Sellers
        if not user:
            collector = Collector.objects.filter(collectorUsername=username_or_email).first() or Collector.objects.filter(collectorEmail=username_or_email).first()
            if collector and check_password(password, collector.collectorpassword):
                user = collector
                role = "Collector"

        # Si el usuario es válido, generar tokens
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "id": user.id_seller if role == "Seller" else user.id_collector,
                "username": user.sellerUsername if role == "Seller" else user.collectorUsername,
                "email": user.sellerEmail if role == "Seller" else user.collectorEmail,
                "phone": user.sellerPhone if role == "Seller" else user.collectorPhone,
                "role": role
            }, status=status.HTTP_200_OK)

        return Response({"error": "Credenciales incorrectas"}, status=status.HTTP_401_UNAUTHORIZED)

from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth.models import User
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.urls import reverse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def send_reset_email(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data.get("email")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return JsonResponse({"error": "No existe un usuario con ese correo"}, status=404)

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        reset_url = f"http://localhost:5173/reset-password/{uid}/{token}/"

        send_mail(
            "Restablecer tu contraseña",
            f"Haz clic en el siguiente enlace para restablecer tu contraseña:\n\n{reset_url}",
            'tu_correo@gmail.com',
            [email],
            fail_silently=False,
        )

        return JsonResponse({"message": "Correo enviado correctamente"})
