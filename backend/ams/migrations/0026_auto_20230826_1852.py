# Generated by Django 3.2.20 on 2023-08-26 18:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ams', '0025_auto_20230826_1812'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='vacation',
            name='end_date',
        ),
        migrations.RemoveField(
            model_name='vacation',
            name='start_date',
        ),
        migrations.AddField(
            model_name='vacation',
            name='vac_attachment',
            field=models.CharField(blank=True, max_length=500, null=True, verbose_name='Attachment'),
        ),
        migrations.AddField(
            model_name='vacation',
            name='vac_end',
            field=models.DateField(blank=True, null=True, verbose_name='End Date'),
        ),
        migrations.AddField(
            model_name='vacation',
            name='vac_reason',
            field=models.TextField(blank=True, null=True, verbose_name='Reason'),
        ),
        migrations.AddField(
            model_name='vacation',
            name='vac_start',
            field=models.DateField(blank=True, null=True, verbose_name='Start Date'),
        ),
        migrations.AlterField(
            model_name='vacation',
            name='vac_total',
            field=models.CharField(blank=True, max_length=100, null=True, verbose_name='Total'),
        ),
    ]
