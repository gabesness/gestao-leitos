from django.db import models
from datetime import datetime
from django.contrib.auth.models import User

class EstagioEnum(models.TextChoices):
    CADASTRADO = "CADASTRADO" # Paciente cadastrado
    PRESCRICAO_CRIADA = "PRESCRICAO_CRIADA" # Prescricao criada
    PRESCRICAO_DEVOLVIDA_PELA_FARMACIA = "DEVOLVIDA_PELA_FARMACIA" # Prescricao devolvida ao medico pela farmacia para alteracao de medicamentos
    PRESCRICAO_DEVOLVIDA_PELA_REGULACAO = "DEVOLVIDA_PELA_REGULACAO" # Prescricao devolvida ao medico pela regulacao para autorizacao de encaminhamento
    ENCAMINHADO_PARA_FARMACIA = "ENCAMINHADO_PARA_FARMACIA" # Paciente encaminhado para a farmacia
    ENCAMINHADO_PARA_AGENDAMENTO = "ENCAMINHADO_PARA_AGENDAMENTO" # Encaminhado para a Regulacao agendar o paciente
    AUTORIZADO_PARA_TRANSFERENCIA = "AUTORIZADO_PARA_TRANSFERENCIA" # Paciente autorizado pelo medico para ser transferido para outro hospital, pendente conf. pela regulacao
    TRANSFERIDO = "TRANSFERIDO" # Transferido para outro hospital
    AGENDADO = "AGENDADO" # Paciente com internacao agendada
    INTERNADO = "INTERNADO"
    ALTA_OBITO = "ALTA_OBITO"
    ALTA_NORMAL = "ALTA_NORMAL"
    ALTA_DEFINITIVA = "ALTA_DEFINITIVA"

    def __str__(self):
        return f"{self.codigo}"

class Paciente(models.Model):
    prontuario = models.CharField(max_length=15, unique=True)
    nome = models.CharField(max_length=256)
    estagio_atual = models.CharField(max_length=128, choices=EstagioEnum.choices)
    plano_terapeutico = models.ForeignKey("Plano_terapeutico", on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f"Paciente {self.nome}"

class Leito(models.Model):
    numero = models.CharField(max_length=16)
    ocupado = models.BooleanField(default=False)
    paciente = models.ForeignKey("Paciente", on_delete=models.CASCADE, null=True, blank=True)

    def __str__(self):
        return f"Leito {self.numero}"

class Sessao(models.Model):
    leito = models.ForeignKey("Leito", on_delete=models.CASCADE, null=True, blank=True)
    paciente = models.ForeignKey("Paciente", on_delete=models.CASCADE)
    data_internacao = models.DateTimeField(null=True, blank=True)
    data_alta = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Sessao do {self.paciente}"

class Registro(models.Model):
    # Quem eh o paciente?
    paciente = models.ForeignKey("Paciente", on_delete=models.CASCADE)
    # Quem fez o registro?
    usuario = models.ForeignKey(User, on_delete=models.CASCADE)
    # De qual internacao estamos falando?
    sessao = models.ForeignKey("Sessao", on_delete=models.CASCADE)
    # Qual eh o estagio atual do paciente?
    estagio_atual = models.CharField(max_length=128, choices=EstagioEnum.choices)
    # Qual eh a mensagem?
    mensagem = models.TextField()

    def agora():
        return datetime.now()
    
    criado_em = models.DateTimeField(editable=False, default=agora)

    def __str__(self):
        return f"Registro de {self.estagio_atual} por {self.usuario}"

class Plano_terapeutico(models.Model):
    sessoes_prescritas = models.IntegerField() # campo editavel
    sessoes_restantes = models.IntegerField() # campo interno para calculo das prox sessoes
    dias_intervalo = models.IntegerField()
    data_sugerida = models.DateField()
    medicamentos = models.CharField(max_length=280)
