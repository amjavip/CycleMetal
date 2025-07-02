from django.db import models
import uuid
from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
    BaseUserManager,
)
from django.utils import timezone
from django.contrib.auth.hashers import make_password


# todo usamos este controlador de usuaruis para evitar usar esto: User.objects.create_user(...)
class CustomUserManager(BaseUserManager):
    def create_user(self, email, username, password=None, role=None, **extra_fields):
        if not email:
            raise ValueError("El email es obligatorio")
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault("role", "admin")
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, username, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ("seller", "Seller"),
        ("collector", "Collector"),
        ("admin", "Admin"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True, max_length=255)
    username = models.CharField(max_length=30, unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    phone = models.CharField(max_length=20, blank=True, null=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)  # para admin site
    date_joined = models.DateTimeField(default=timezone.now)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username", "role"]

    def __str__(self):
        return f"{self.email} ({self.role}) {self.id}"


# Perfiles específicos para datos extra


class SellerProfile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="sellerprofile"
    )
    # Aquí pones campos específicos para seller, por ejemplo:
    code = models.CharField(max_length=11, unique=True, blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.code:
            while True:
                code = f"SEL-{uuid.uuid4().hex[:6].upper()}"
                if not SellerProfile.objects.filter(code=code).exists():
                    self.code = code
                    break
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Seller Profile {self.code} - {self.user.email}"


class CollectorProfile(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="collectorprofile"
    )

    code = models.CharField(max_length=11, unique=True, blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.code:
            while True:
                code = f"COL-{uuid.uuid4().hex[:6].upper()}"
                if not CollectorProfile.objects.filter(code=code).exists():
                    self.code = code
                    break
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Collector Profile {self.code} - {self.user.email}"
