# Generated by Django 4.2.6 on 2024-01-30 13:45

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ams', '0002_alter_schedule_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='transaction',
            name='trans_action',
        ),
    ]
