from rest_framework import serializers
from .models import Seller, Collector
from rest_framework import serializers
from .models import Seller

class SellerSerializer(serializers.ModelSerializer):

    username = serializers.CharField(source='sellerUsername')  
    password = serializers.CharField(source='sellerpassword')
    email = serializers.EmailField(source='sellerEmail')
    phone = serializers.CharField(source='sellerPhone')
    class Meta:
        model = Seller
        fields = '__all__' 

        extra_kwargs = {
                        'code': {'required': False}, 
                        'create_by': {'required': False},
                        'create_at': {'required': False},
                        'update_at': {'required': False},
                        }

class CollectorSerializer(serializers.ModelSerializer):
    password = serializers.CharField(source='collectorpassword')
    username = serializers.CharField(source='collectorUsername')  
    email = serializers.EmailField(source='collectorEmail')
    phone = serializers.CharField(source='collectorPhone')
 
    class Meta:
        model = Collector
        
        fields = '__all__' 
        
        extra_kwargs = {
                        'code': {'required': False}, 
                        'create_by': {'required': False},
                        'create_at': {'required': False},
                        'update_at': {'required': False},
                        }
