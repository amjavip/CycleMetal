# serializers.py

from rest_framework import serializers
from .models import Order, OrderItem, Item
from users.models import Seller, Collector  # Asumiendo que ya tienes esto


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ["order", "item", "cantidad", "total"]
        read_only_fields = ["total"]  # total se calcula en save()


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    id_seller = serializers.PrimaryKeyRelatedField(queryset=Seller.objects.all())
    id_collector = serializers.PrimaryKeyRelatedField(
        queryset=Collector.objects.all(), allow_null=True, required=False
    )

    class Meta:
        model = Order
        fields = [
            "id_order",
            "id_seller",
            "id_collector",
            "orderCreationDay",
            "items",
            "status",
            "lat",
            "lon",
            "total",
        ]
        read_only_fields = ["id_order", "orderCreationDay"]

    def create(self, validated_data):
        items_data = validated_data.pop("items")
        order = Order.objects.create(**validated_data)
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        return order


from rest_framework import serializers
from .models import Item


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = ["id", "nombre", "descripcion", "precio", "es_personalizado"]
