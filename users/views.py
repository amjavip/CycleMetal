
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
from django.contrib.auth.models import User


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

class CollectorViewSet(viewsets.ModelViewSet):
    queryset = Collector.objects.all()
    serializer_class = CollectorSerializer
    permission_classes = [IsAuthenticated] 

class LoginView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        
        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            return Response({"token": token.key})
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
