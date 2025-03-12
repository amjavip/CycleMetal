from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import User, Seller, Collector

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'phone_number', 'password']
        extra_kwargs = {
            'password': {'write_only': True}  
        }

 
    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)
    
class SellerSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Seller
        fields = ['id', 'seller_code', 'user']

    def create(self, validated_data):
        user_data = validated_data.pop('user') 
        user = User.objects.create_user(**user_data)  
        seller = Seller.objects.create(user=user, **validated_data) 
        return seller
    
class CollectorSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Collector
        fields = ['id', 'collector_code', 'user']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data)
        collector = Collector.objects.create(user=user, **validated_data)
        return collector
