# Generated by Django 5.1.7 on 2025-07-04 21:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("collection", "0003_vehicle"),
    ]

    operations = [
        migrations.AddField(
            model_name="vehicle",
            name="modelo_3d",
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]
