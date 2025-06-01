from django.db import models
import uuid

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('ontheway', 'En camino'),
        ('rejected', 'Rechazado'),
        ('cancelled', 'Cancelado'),
        ('completed', 'Completado'),
    ]

    id_order = models.CharField(max_length=14, unique=True, editable=False, null=False)
    orderCreationDay = models.DateTimeField(auto_now_add=True)  
    id_seller = models.ForeignKey("users.Seller", on_delete=models.CASCADE, null=True, blank=True)
    id_collector = models.ForeignKey("users.Collector", on_delete=models.SET_NULL, null=True, blank=True)  # Aquí permitimos null y blank
    status = models.CharField(max_length=20, null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.id_order:  
            prefix = 'ORD'
            unique_id = str(uuid.uuid4().hex[:8]).upper()  
            self.id_order = f"{prefix}-{unique_id}" 
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.id_order} - {self.id_collector}"

    @property
    def total(self):
        return sum(item.subtotal() for item in self.items.all())
class Item(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    es_personalizado = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.nombre}"
    
class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField(default=1)

    def subtotal(self):
        return self.item.precio * self.cantidad

    def __str__(self):
        return f"{self.cantidad} x {self.item.nombre} para {self.order.id_order}"
