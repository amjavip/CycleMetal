from django.db import models
import uuid
class Route(models.Model):
    ID_route = models.CharField(primary_key=True, max_length=11, unique=True, editable=False, null=False)
    routeStartLocation = models.CharField(max_length=255, blank=True, null=True)  
    routeEndLocation = models.CharField(max_length=255, blank=True, null=True)  
    routeDistance = models.FloatField(blank=True, null=True)  
    routeEstimatedTime = models.DurationField(blank=True, null=True) 
    routeGeometry = models.CharField(max_length=500, editable=False, null=False, blank=False)
   
    def save(self, *args, **kwargs):
        if not self.ID_route:  
            prefix = 'ROU'
            unique_id = str(uuid.uuid4().hex[:6]).upper()  
            self.ID_route = f"{prefix}-{unique_id}" 
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.ID_route} - {self.routeCreationDay}"
    
