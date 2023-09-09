# Generated by Django 3.2.20 on 2023-08-26 11:50

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ams', '0019_alter_option_opt_category'),
    ]

    operations = [
        migrations.AlterField(
            model_name='option',
            name='opt_category',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='ams.category', verbose_name='Category'),
        ),
    ]