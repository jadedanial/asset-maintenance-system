# Generated by Django 4.2.6 on 2024-01-30 14:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ams', '0003_remove_transaction_trans_action'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='transaction',
            name='trans_id',
        ),
        migrations.AddField(
            model_name='transaction',
            name='trans_code',
            field=models.CharField(blank=True, max_length=100, null=True, verbose_name='Transaction Code'),
        ),
    ]