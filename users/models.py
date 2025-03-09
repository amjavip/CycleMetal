from django.db import models
import uuid

class Seller(models.Model):
    ID_seller = models.CharField(max_length=20, unique=True, editable=False)
    username = models.CharField(max_length=20, unique=True, blank=False, null=False)
    name = models.TextField(max_length=15, blank=True, null=True)
    fsurname = models.TextField(max_length=15, blank=True, null=True)
    ssurname = models.TextField(max_length=15, blank=True, null=True)
    phone_number = models.CharField(max_length=16, blank=True, null=True)
    gmail = models.EmailField(max_length=254, blank=True, null=True)
    def save(self, *args, **kwargs):
        if not self.ID_seller:  
            prefix = 'SEL'
            unique_id = str(uuid.uuid4().hex[:6]).upper()  
            self.ID_seller = f"{prefix}-{unique_id}" 
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.ID_seller} - {self.username}"
    
class Collector(models.Model):
    ID_seller = models.CharField(max_length=20, unique=True, editable=False)
    username = models.CharField(max_length=20, unique=True, blank=False, null=False)
    name = models.TextField(max_length=15, blank=True, null=True)
    fsurname = models.TextField(max_length=15, blank=True, null=True)
    ssurname = models.TextField(max_length=15, blank=True, null=True)
    phone_number = models.CharField(max_length=16, blank=True, null=True)
    gmail = models.EmailField(max_length=254, blank=True, null=True)
    def save(self, *args, **kwargs):
        if not self.ID_seller:  
            prefix = 'SEL'
            unique_id = str(uuid.uuid4().hex[:6]).upper()  
            self.ID_seller = f"{prefix}-{unique_id}" 
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.ID_seller} - {self.username}"