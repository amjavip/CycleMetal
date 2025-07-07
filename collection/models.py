from django.db import models
import uuid
from django.conf import settings


class Order(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pendiente"),
        ("ontheway", "En camino"),
        ("accepted", "Aceptado"),
        ("cancelled", "Cancelado"),
        ("completed", "Completado"),
    ]

    id = models.CharField(
        primary_key=True, max_length=14, unique=True, editable=False, null=False
    )
    orderCreationDay = models.DateTimeField(auto_now_add=True)
    id_seller = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="orders_as_seller",  # nombre único para la relación inversa
        limit_choices_to={"role": "seller"},
    )
    id_collector = models.ForeignKey(
        "users.User",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="orders_as_collector",  # nombre único para la relación inversa
        limit_choices_to={"role": "collector"},
    )
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, null=True, blank=True
    )
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    comision = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tip = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    lat = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    lon = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    payment_intent_id = models.CharField(max_length=255, null=True, blank=True)

    METODO_PAGO_CHOICES = [("cash", "Cash"), ("card", "Card")]
    metodo_pago = models.CharField(
        max_length=20, choices=METODO_PAGO_CHOICES, null=True, blank=True
    )

    def save(self, *args, **kwargs):
        if not self.id:
            prefix = "ORD"
            unique_id = str(uuid.uuid4().hex[:8]).upper()
            self.id = f"{prefix}-{unique_id}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.id} - {self.id_collector} - {self.orderCreationDay}"


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
        return f"{self.cantidad} x {self.item.nombre} para {self.order.id}"


from django.db import models


class Vehicle(models.Model):
    TYPE_CHOICES = [
        ("auto", "Auto"),
        ("camion", "Camión"),
        ("pickup", "Camioneta Pick Up"),
        ("carreta", "Carreta"),
        ("caminar", "Caminar"),
    ]

    tipo = models.CharField(max_length=20, choices=TYPE_CHOICES, null=True, blank=True)
    nombre = models.CharField(max_length=50, null=True, blank=True)

    capacidad = models.PositiveIntegerField(
        help_text="Capacidad máxima en kg ",
        null=True,
        blank=True,
    )
    velocidad = models.PositiveIntegerField(
        help_text="Velocidad promedio en km/h", null=True, blank=True
    )
    consumo = models.PositiveIntegerField(
        help_text="Consumo aproximado en L/km", null=True, blank=True
    )
    modelo_3d = models.CharField(
        max_length=200,
        null=True,
        blank=True,
    )

    def __str__(self):
        return f"{self.nombre or 'Vehículo'} - {self.tipo}"

    @property
    def modelo_3d_url(self):
        if self.modelo_3d:
            return f"/static/{self.modelo_3d}"
        if self.tipo:
            return f"/static/3dmodels/{self.tipo}.glb"
        return None
