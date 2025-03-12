from django.db import models
import uuid

class Seller(models.Model):
    ID_seller = models.CharField(max_length=20, unique=True, editable=False)
    SellerPasword = models.CharField(max_length=15, null=False, blank=False)
    sellerUsername = models.CharField(max_length=20, unique=True, blank=False, null=False)
    sellerName = models.TextField(max_length=15, blank=True, null=True)
    sellerFirstSurname = models.TextField(max_length=15, blank=True, null=True)
    sellerSecondSurname = models.TextField(max_length=15, blank=True, null=True)
    sellerPhoneNumber = models.CharField(max_length=16, blank=True, null=True)
    sellerGmail = models.EmailField(max_length=254, blank=True, null=True)
    def save(self, *args, **kwargs):
        if not self.ID_seller:  
            prefix = 'SEL'
            unique_id = str(uuid.uuid4().hex[:6]).upper()  
            self.ID_seller = f"{prefix}-{unique_id}" 
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.ID_seller} - {self.sellerUsername}"
    
class Collector(models.Model):
    ID_collector = models.CharField(max_length=20, unique=True, editable=False)
    collectorPassword = models.CharField(max_length=15, null=False, blank=False)
    collectorUsername = models.CharField(max_length=20, unique=True, blank=False, null=False)
    collectorName = models.TextField(max_length=15, blank=True, null=True)
    collectorFirstSurname = models.TextField(max_length=15, blank=True, null=True)
    collectorSecondSurname = models.TextField(max_length=15, blank=True, null=True)
    collectorPhoneNumber = models.CharField(max_length=16, blank=True, null=True)
    collectorGmail = models.EmailField(max_length=254, blank=True, null=True)
    def save(self, *args, **kwargs):
        if not self.ID_collector:  
            prefix = 'COL'
            unique_id = str(uuid.uuid4().hex[:6]).upper()  
            self.ID_collector = f"{prefix}-{unique_id}" 
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.ID_collector} - {self.collectorUsername}"