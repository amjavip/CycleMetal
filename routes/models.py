from django.db import models
from collection.models import Order
import uuid
from django.utils import timezone


class Route(models.Model):
    id = models.CharField(
        primary_key=True, max_length=11, unique=True, editable=False, null=False
    )
    order = models.OneToOneField(
        Order,
        on_delete=models.CASCADE,
        related_name="route",
        null=True,
        blank=True,
    )

    lat = models.CharField(max_length=255, blank=True, null=True)
    lon = models.CharField(max_length=255, blank=True, null=True)
    endlat = models.CharField(max_length=255, blank=True, null=True)
    endlon = models.CharField(max_length=255, blank=True, null=True)

    routeDistance = models.FloatField(blank=True, null=True)
    routeGeometry = models.TextField(null=True, blank=True)

    routeCreationDay = models.DateTimeField(default=timezone.now)

    def save(self, *args, **kwargs):
        if not self.id:
            prefix = "ROU"
            unique_id = str(uuid.uuid4().hex[:6]).upper()
            self.id = f"{prefix}-{unique_id}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.id} - {self.routeCreationDay}"
