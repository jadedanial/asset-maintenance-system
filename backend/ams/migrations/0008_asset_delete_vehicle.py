# Generated by Django 4.2.6 on 2024-04-12 06:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ams', '0007_rename_empid_user_userid'),
    ]

    operations = [
        migrations.CreateModel(
            name='Asset',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('asset_code', models.CharField(blank=True, max_length=100, null=True, verbose_name='Asset Code')),
                ('asset_type', models.CharField(blank=True, max_length=200, null=True, verbose_name='Type')),
                ('asset_model', models.CharField(blank=True, max_length=200, null=True, verbose_name='Model')),
                ('asset_serial', models.CharField(blank=True, max_length=300, null=True, verbose_name='Serial')),
                ('asset_plate', models.CharField(blank=True, max_length=100, null=True, verbose_name='Plate')),
                ('asset_area', models.CharField(blank=True, max_length=200, null=True, verbose_name='Area')),
                ('asset_sector', models.CharField(blank=True, max_length=300, null=True, verbose_name='Sector')),
                ('asset_status', models.CharField(blank=True, max_length=100, null=True, verbose_name='Status')),
            ],
        ),
        migrations.DeleteModel(
            name='Vehicle',
        ),
    ]