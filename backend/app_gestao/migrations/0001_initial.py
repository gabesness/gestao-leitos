# Generated by Django 5.0.4 on 2024-06-11 22:06

import app_gestao.models
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Paciente',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('prontuario', models.CharField(max_length=15, unique=True)),
                ('nome', models.CharField(max_length=256)),
                ('estagio_atual', models.CharField(choices=[('CADASTRADO', 'Cadastrado'), ('PRESCRICAO_CRIADA', 'Prescricao Criada'), ('DEVOLVIDA_PELA_FARMACIA', 'Prescricao Devolvida Pela Farmacia'), ('DEVOLVIDA_PELA_REGULACAO', 'Prescricao Devolvida Pela Regulacao'), ('ENCAMINHADO_PARA_FARMACIA', 'Encaminhado Para Farmacia'), ('ENCAMINHADO_PARA_AGENDAMENTO', 'Encaminhado Para Agendamento'), ('AUTORIZADO_PARA_TRANSFERENCIA', 'Autorizado Para Transferencia'), ('TRANSFERIDO', 'Transferido'), ('AGENDADO', 'Agendado'), ('INTERNADO', 'Internado'), ('ALTA_OBITO', 'Alta Obito'), ('ALTA_NORMAL', 'Alta Normal'), ('ALTA_DEFINITIVA', 'Alta Definitiva')], max_length=128)),
            ],
        ),
        migrations.CreateModel(
            name='Leito',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('numero', models.CharField(max_length=16)),
                ('ocupado', models.BooleanField(default=False)),
                ('paciente', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='app_gestao.paciente')),
            ],
        ),
        migrations.CreateModel(
            name='Plano_terapeutico',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('dias_internado', models.IntegerField()),
                ('dias_intervalo', models.IntegerField()),
                ('numero_sessoes', models.IntegerField()),
                ('data_sugerida', models.DateField()),
                ('medicamentos', models.CharField(max_length=280)),
                ('paciente', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app_gestao.paciente')),
            ],
        ),
        migrations.CreateModel(
            name='Sessao',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('data_internacao', models.DateTimeField(blank=True, null=True)),
                ('data_alta', models.DateTimeField(blank=True, null=True)),
                ('leito', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='app_gestao.leito')),
                ('paciente', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app_gestao.paciente')),
            ],
        ),
        migrations.CreateModel(
            name='Registro',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('estagio_atual', models.CharField(choices=[('CADASTRADO', 'Cadastrado'), ('PRESCRICAO_CRIADA', 'Prescricao Criada'), ('DEVOLVIDA_PELA_FARMACIA', 'Prescricao Devolvida Pela Farmacia'), ('DEVOLVIDA_PELA_REGULACAO', 'Prescricao Devolvida Pela Regulacao'), ('ENCAMINHADO_PARA_FARMACIA', 'Encaminhado Para Farmacia'), ('ENCAMINHADO_PARA_AGENDAMENTO', 'Encaminhado Para Agendamento'), ('AUTORIZADO_PARA_TRANSFERENCIA', 'Autorizado Para Transferencia'), ('TRANSFERIDO', 'Transferido'), ('AGENDADO', 'Agendado'), ('INTERNADO', 'Internado'), ('ALTA_OBITO', 'Alta Obito'), ('ALTA_NORMAL', 'Alta Normal'), ('ALTA_DEFINITIVA', 'Alta Definitiva')], max_length=128)),
                ('mensagem', models.TextField()),
                ('criado_em', models.DateTimeField(default=app_gestao.models.Registro.agora, editable=False)),
                ('paciente', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app_gestao.paciente')),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('sessao', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app_gestao.sessao')),
            ],
        ),
    ]
