from django.db import models
import uuid


class Order(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pendiente"),
        ("ontheway", "En camino"),
        ("rejected", "Rechazado"),
        ("cancelled", "Cancelado"),
        ("completed", "Completado"),
    ]

    id_order = models.CharField(max_length=14, unique=True, editable=False, null=False)
    orderCreationDay = models.DateTimeField(auto_now_add=True)
    id_seller = models.ForeignKey(
        "users.Seller", on_delete=models.CASCADE, null=True, blank=True
    )
    id_collector = models.ForeignKey(
        "users.Collector", on_delete=models.SET_NULL, null=True, blank=True
    )
    status = models.CharField(max_length=20, null=True, blank=True)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    comision = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tip = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    lat = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    lon = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    METODO_PAGO_CHOICES = [("efectivo", "Efectivo"), ("tarjeta", "Tarjeta")]
    metodo_pago = models.CharField(
        max_length=20, choices=METODO_PAGO_CHOICES, null=True, blank=True
    )

    def save(self, *args, **kwargs):
        if not self.id_order:
            prefix = "ORD"
            unique_id = str(uuid.uuid4().hex[:8]).upper()
            self.id_order = f"{prefix}-{unique_id}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.id_order} - {self.id_collector}"


class Item(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    es_personalizado = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.nombre}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField(default=1)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def save(self, *args, **kwargs):
        # Calcula el total antes de guardar
        self.total = self.item.precio * self.cantidad
        super().save(*args, **kwargs)

    def subtotal(self):
        # Método que devuelve subtotal, útil para otros cálculos o uso
        return self.total

    def __str__(self):
        return f"{self.cantidad} x {self.item.nombre} para {self.order.id_order}"
