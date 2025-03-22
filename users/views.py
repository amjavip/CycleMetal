
from rest_framework import viewsets
from .models import Seller, Collector
from .serializer import SellerSerializer, CollectorSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.response import Response
from .serializer import SellerSerializer


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializer import SellerSerializer, CollectorSerializer

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
