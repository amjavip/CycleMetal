from rest_framework import serializers
from .models import User, SellerProfile, CollectorProfile
from collection.serializer import VehicleSerializer


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    date_joined = serializers.DateTimeField(format="iso-8601", read_only=True)

    class Meta:
        model = User
        fields = ["id", "email", "username", "password", "role", "phone", "date_joined"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        # Crear perfil según rol
        if user.role == "seller":
            SellerProfile.objects.create(user=user)
        elif user.role == "collector":
            CollectorProfile.objects.create(user=user)
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class SellerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellerProfile
        fields = ["code"]


class CollectorProfileSerializer(serializers.ModelSerializer):
    vehicle = VehicleSerializer(read_only=True)

    class Meta:
        model = CollectorProfile
        fields = ["code", "vehicle", "has_active_route"]
