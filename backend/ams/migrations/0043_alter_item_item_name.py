# Generated by Django 4.2.6 on 2023-12-01 22:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ams', '0042_vehicle_delete_asset'),
    ]

    operations = [
        migrations.AlterField(
            model_name='item',
            name='item_name',
            field=models.CharField(max_length=100, verbose_name='Name'),
        ),
    ]
