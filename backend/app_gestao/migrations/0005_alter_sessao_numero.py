# Generated by Django 5.0.4 on 2024-09-19 20:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_gestao', '0004_alter_sessao_paciente'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sessao',
            name='numero',
            field=models.IntegerField(default=None, editable=False),
        ),
    ]
