# Generated by Django 4.2.6 on 2023-12-02 18:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ams', '0043_alter_item_item_name'),
    ]

    operations = [
        migrations.CreateModel(
            name='Warehouse',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('warehouse_code', models.CharField(blank=True, max_length=100, null=True, verbose_name='Warehouse Code')),
                ('warehouse_name', models.CharField(max_length=200, verbose_name='Name')),
                ('warehouse_type', models.CharField(max_length=200, verbose_name='Type')),
                ('warehouse_location', models.CharField(max_length=300, verbose_name='Location')),
            ],
        ),
    ]
