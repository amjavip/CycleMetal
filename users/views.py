
from rest_framework import viewsets
from .models import Seller, Collector
from .serializer import SellerSerializer, CollectorSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.response import Response
from .serializer import SellerSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response

from django.contrib.auth.hashers import check_password
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import action


class RegisterUserView(APIView):
    def post(self, request):
        role = request.data.get('role')

        if role == 'seller':
            serializer = SellerSerializer(data=request.data)
            print(request.data)
        elif role == 'collector':
            serializer = CollectorSerializer(data=request.data)
            print(request.data)
        else:
            return Response({"error": "Role must be either 'seller' or 'collector'"}, status=status.HTTP_400_BAD_REQUEST)

        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": f"User registered as {role} successfully",
                
            }, status=status.HTTP_201_CREATED)
        else:
            print("Errores de validación:", serializer.errors)  
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def check_username(request):
    # Obtener username y email desde request.data (ya que es una solicitud POST)
    username = request.data.get('username')
    email = request.data.get('email')

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

    @action(detail=False, methods=['get'], url_path='seller_show_data')
    def show_data(self, request):
        try:
            seller = Seller.objects.get(user=request.user)
        except Seller.DoesNotExist:
            return Response({'error': 'No existe un perfil de vendedor para este usuario'}, status=404)
        
        serializer = self.get_serializer(seller)
        return Response(serializer.data)

class CollectorViewSet(viewsets.ModelViewSet):
    queryset = Collector.objects.all()
    serializer_class = CollectorSerializer
    permission_classes = [IsAuthenticated] 


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
