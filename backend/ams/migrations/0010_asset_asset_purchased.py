# Generated by Django 4.2.6 on 2024-04-12 09:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ams', '0009_asset_asset_category'),
    ]

    operations = [
        migrations.AddField(
            model_name='asset',
            name='asset_purchased',
            field=models.DateField(blank=True, null=True, verbose_name='Date Purchased'),
        ),
    ]
