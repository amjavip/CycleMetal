'''

Autor: Javier -amjavip

Notas:

Recuerda que puedes encontrar informacion mas resumida en la documentacion del proyecto
puedes encontrarla en http://127.0.0.1:8000/users/api/docs/ esta la encontraras al momento
de iniciar el servidor del backend.

Si estas usando una version de python igual o superior a la 3.12 es importante que algunas
librerias no estan disponibles debido a que se consideran obsoletas, para evitar estos problemas
de recomienda usar la version 3.10 ya que con esta versiona sido desarrollado este programa.

Para cualquier aclaracion especifica visita la documentacion de django consultala en este link
https://www.django-rest-framework.org/

'''

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
    @property
    def id(self):
        return self.id_seller



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
    @property
    def id(self):
         return self.id_collector

