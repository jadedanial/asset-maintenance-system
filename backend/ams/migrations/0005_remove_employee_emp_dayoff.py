# Generated by Django 4.1.5 on 2023-02-28 16:14

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ams', '0004_alter_employee_emp_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='employee',
            name='emp_dayoff',
        ),
    ]
