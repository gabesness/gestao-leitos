# Generated by Django 5.0.4 on 2024-06-18 01:07

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_gestao', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='paciente',
            name='leito',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='app_gestao.leito'),
        ),
    ]
