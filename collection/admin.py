from django.contrib import admin
from .models import Order, OrderItem, Item, Vehicle

admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Item)
admin.site.register(Vehicle)
