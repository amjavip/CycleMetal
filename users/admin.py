from django.contrib import admin

# De esto:

# A esto (si usas el modelo User y perfiles)
from .models import User, SellerProfile, CollectorProfile

admin.site.register(User)
admin.site.register(SellerProfile)
admin.site.register(CollectorProfile)
