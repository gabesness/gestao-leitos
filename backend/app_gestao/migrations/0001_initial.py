# Generated by Django 5.0.4 on 2024-05-30 19:32

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
                ('estagio_atual', models.CharField(choices=[('Paciente cadastrado', 'Cadastrado'), ('Prescrição criada', 'Prescricao Criada'), ('Prescrição devolvida pela Farmácia para o médico', 'Prescricao Devolvida Pela Farmacia'), ('Prescrição devolvida pela Regulação para o médico', 'Prescricao Devolvida Pela Regulacao'), ('Prescrição encaminhada para a Farmácia', 'Encaminhado Para Farmacia'), ('Prescrição encaminhada para agendamento', 'Encaminhado Para Agendamento'), ('Paciente autorizado para transferência', 'Autorizado Para Transferencia'), ('Paciente transferido para outro hospital', 'Transferido'), ('Internação agendada', 'Agendado'), ('Paciente internado', 'Internado'), ('Paciente falecido', 'Alta Obito'), ('Paciente com alta registrada', 'Alta Normal'), ('Paciente com alta definitiva registrada', 'Alta Definitiva')], default='Paciente cadastrado', max_length=128)),
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
                ('estagio_atual', models.CharField(choices=[('Paciente cadastrado', 'Cadastrado'), ('Prescrição criada', 'Prescricao Criada'), ('Prescrição devolvida pela Farmácia para o médico', 'Prescricao Devolvida Pela Farmacia'), ('Prescrição devolvida pela Regulação para o médico', 'Prescricao Devolvida Pela Regulacao'), ('Prescrição encaminhada para a Farmácia', 'Encaminhado Para Farmacia'), ('Prescrição encaminhada para agendamento', 'Encaminhado Para Agendamento'), ('Paciente autorizado para transferência', 'Autorizado Para Transferencia'), ('Paciente transferido para outro hospital', 'Transferido'), ('Internação agendada', 'Agendado'), ('Paciente internado', 'Internado'), ('Paciente falecido', 'Alta Obito'), ('Paciente com alta registrada', 'Alta Normal'), ('Paciente com alta definitiva registrada', 'Alta Definitiva')], max_length=128)),
                ('mensagem', models.TextField()),
                ('criado_em', models.DateTimeField(default=app_gestao.models.Registro.agora, editable=False)),
                ('paciente', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app_gestao.paciente')),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('sessao', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app_gestao.sessao')),
            ],
        ),
    ]
