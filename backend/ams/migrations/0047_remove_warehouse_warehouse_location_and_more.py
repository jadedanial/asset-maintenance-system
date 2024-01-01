# Generated by Django 4.2.6 on 2024-01-01 16:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ams', '0046_employee_emp_branch'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='warehouse',
            name='warehouse_location',
        ),
        migrations.AddField(
            model_name='warehouse',
            name='warehouse_branch',
            field=models.CharField(blank=True, max_length=300, null=True, verbose_name='Branch'),
        ),
    ]
