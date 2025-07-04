# Generated by Django 5.1.7 on 2025-06-25 04:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("collection", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="order",
            name="status",
            field=models.CharField(
                blank=True,
                choices=[
                    ("pending", "Pendiente"),
                    ("ontheway", "En camino"),
                    ("rejected", "Rechazado"),
                    ("cancelled", "Cancelado"),
                    ("completed", "Completado"),
                ],
                max_length=20,
                null=True,
            ),
        ),
    ]
