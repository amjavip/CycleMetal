# Generated by Django 5.1.7 on 2025-03-09 01:38

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Seller',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ID_seller', models.CharField(editable=False, max_length=20, unique=True)),
                ('username', models.CharField(max_length=20, unique=True)),
                ('name', models.TextField(blank=True, max_length=15, null=True)),
                ('fsurname', models.TextField(blank=True, max_length=15, null=True)),
                ('ssurname', models.TextField(blank=True, max_length=15, null=True)),
                ('phone_number', models.CharField(blank=True, max_length=16, null=True)),
                ('gmail', models.EmailField(blank=True, max_length=254, null=True)),
            ],
        ),
    ]
