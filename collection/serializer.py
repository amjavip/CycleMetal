from rest_framework import serializers
from .models import Order, OrderItem, Item
from django.conf import settings
from users.models import User  # tu modelo personalizado User


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ["order", "item", "cantidad", "total"]
        read_only_fields = ["total"]  # total se calcula en save()


class UserPrimaryKeyRelatedField(serializers.PrimaryKeyRelatedField):
    def get_queryset(self):
        role = self.context.get("role")
        if role:
            return User.objects.filter(role=role)
        return User.objects.all()


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    id_seller = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role="seller")
    )
    id_collector = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role="collector"), allow_null=True, required=False
    )

    class Meta:
        model = Order
        fields = "__all__"

        read_only_fields = ["id_order", "orderCreationDay"]

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        order = Order.objects.create(**validated_data)
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        return order


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ["id", "nombre", "descripcion", "precio", "es_personalizado"]
