# Generated by Django 4.2.6 on 2024-04-15 16:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ams', '0011_alter_asset_asset_area_alter_excuse_exc_total_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='asset',
            name='asset_area',
            field=models.CharField(blank=True, max_length=200, null=True, verbose_name='Area'),
        ),
    ]
