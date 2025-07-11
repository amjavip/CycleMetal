# Generated by Django 5.1.7 on 2025-07-07 00:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("collection", "0007_alter_order_status"),
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
                    ("accepted", "Aceptado"),
                    ("cancelled", "Cancelado"),
                    ("completed", "Completado"),
                ],
                max_length=20,
                null=True,
            ),
        ),
    ]
