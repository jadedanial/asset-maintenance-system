# Generated by Django 4.2.6 on 2023-12-01 22:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ams', '0041_alter_asset_asset_area_alter_asset_asset_model_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Vehicle',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('vehicle_code', models.CharField(blank=True, max_length=100, null=True, verbose_name='Vehicle Code')),
                ('vehicle_type', models.CharField(blank=True, max_length=200, null=True, verbose_name='Type')),
                ('vehicle_model', models.CharField(blank=True, max_length=200, null=True, verbose_name='Model')),
                ('vehicle_serial', models.CharField(blank=True, max_length=300, null=True, verbose_name='Serial')),
                ('vehicle_plate', models.CharField(blank=True, max_length=100, null=True, verbose_name='Plate')),
                ('vehicle_area', models.CharField(blank=True, max_length=200, null=True, verbose_name='Area')),
                ('vehicle_sector', models.CharField(blank=True, max_length=300, null=True, verbose_name='Sector')),
                ('vehicle_status', models.CharField(blank=True, max_length=100, null=True, verbose_name='Status')),
            ],
        ),
        migrations.DeleteModel(
            name='Asset',
        ),
    ]
