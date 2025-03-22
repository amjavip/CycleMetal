from django.db import models
import uuid
from django.contrib.auth.hashers import make_password

class Seller(models.Model):
    id_seller = models.CharField(max_length=11, primary_key=True,blank=True,  editable=False)
    sellerpassword = models.CharField(max_length=128, blank=True, null=True)
    sellerEmail = models.EmailField(max_length=30, blank=True, null=True)  # EmailField en lugar de CharField
    sellerUsername = models.CharField(max_length=20, blank=True, null=True)
    sellerPhone = models.CharField(max_length=11, null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.id_seller:
            while True:
                unique_id = f"SEL-{uuid.uuid4().hex[:6].upper()}"  # Prefijo SEL- para evitar conflicto con Collector
                if not Seller.objects.filter(id_seller=unique_id).exists():
                    self.id_seller = unique_id
                    break  
        if self.sellerpassword and not self.sellerpassword.startswith("pbkdf2_sha256$"):  
            self.sellerpassword = make_password(self.sellerpassword)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.id_seller} - {self.sellerUsername}"


class Collector(models.Model):
    id_collector = models.CharField(max_length=11, primary_key=True, blank=True, editable=False)
    collectorpassword = models.CharField(max_length=128, blank=True, null=True)
    collectorEmail = models.EmailField(max_length=30, blank=True, null=True)  
    collectorUsername = models.CharField(max_length=20, blank=True, null=True)
    collectorPhone = models.CharField(max_length=11, null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.id_collector:
            while True:
                unique_id = f"COL-{uuid.uuid4().hex[:6].upper()}"
                if not Collector.objects.filter(id_collector=unique_id).exists():  # Corregido: revisar en Collector
                    self.id_collector = unique_id
                    break 
        if self.collectorpassword and not self.collectorpassword.startswith("pbkdf2_sha256$"):  
            self.collectorpassword = make_password(self.collectorpassword)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.id_collector} - {self.collectorUsername}"
