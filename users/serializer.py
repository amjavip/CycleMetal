from rest_framework import serializers
from .models import Seller, Collector
from rest_framework import serializers
from .models import Seller

class SellerSerializer(serializers.ModelSerializer):
    # Mapeo explícito entre los campos del formulario y los del modelo
    username = serializers.CharField(source='sellerUsername')  # Mapear username al campo sellerUsername
    password = serializers.CharField(source='sellerpassword')
    email = serializers.EmailField(source='sellerEmail')
    phone = serializers.CharField(source='sellerPhone')
    class Meta:
        model = Seller
        fields = '__all__'  # Incluye el campo role si lo necesitas
        extra_kwargs = {
                        'code': {'required': False}, 
                        'create_by': {'required': False},
                        'create_at': {'required': False},
                        'update_at': {'required': False},
                        }

class CollectorSerializer(serializers.ModelSerializer):
    # Mapeo explícito entre los campos del formulario y los del modelo
    username = serializers.CharField(source='collectorUsername')  # Mapear username al campo sellerUsername
    password = serializers.CharField(source='collectorpassword')
    email = serializers.EmailField(source='collectorEmail')
    phone = serializers.CharField(source='collectorPhone')
 
    class Meta:
        model = Collector
        fields = '__all__'  # Incluye el campo role si lo necesitas
        extra_kwargs = {
                        'code': {'required': False}, 
                        'create_by': {'required': False},
                        'create_at': {'required': False},
                        'update_at': {'required': False},
                        }
