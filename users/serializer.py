from rest_framework import serializers
from .models import Seller, Collector

class SellerSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Seller
        fields = '__all__'
        
class CollectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collector
        fields = '__all__'