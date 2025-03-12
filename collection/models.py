from django.db import models
import uuid

class Order(models.Model):
    ID_order = models.CharField(max_length=14, unique=True, editable=False, null=False)
    orderCreationDay = models.DateTimeField(auto_now_add=True)  
    assigned_collector = models.ForeignKey(
        'users.Collector', on_delete=models.SET_NULL, null=True, blank=True
    )  


    routeStartLocation = models.CharField(max_length=255, blank=True, null=True)  
    routeEndLocation = models.CharField(max_length=255, blank=True, null=True)  
    routeDistance = models.FloatField(blank=True, null=True)  
    routeEstimatedTime = models.DurationField(blank=True, null=True)  
    
    def save(self, *args, **kwargs):
        if not self.ID_order:  
            prefix = 'ORD'
            unique_id = str(uuid.uuid4().hex[:8]).upper()  
            self.ID_order = f"{prefix}-{unique_id}" 
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.ID_order} - {self.assigned_collector}"