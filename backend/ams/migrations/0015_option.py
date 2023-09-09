# Generated by Django 3.2.20 on 2023-08-26 10:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ams', '0014_vacation'),
    ]

    operations = [
        migrations.CreateModel(
            name='Option',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=300, verbose_name='Option Name')),
                ('category', models.CharField(max_length=200, verbose_name='Category')),
                ('value', models.CharField(blank=True, max_length=200, null=True, verbose_name='Value')),
            ],
        ),
    ]