'''

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

'''

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
