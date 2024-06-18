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

class Paciente(models.Model):
    nome = models.CharField(max_length=256)
    prontuario = models.CharField(max_length=15, unique=True)
    estagio_atual = models.CharField(max_length=128, choices=EstagioEnum.choices, default=EstagioEnum.CADASTRADO)
    leito = models.ForeignKey("Leito", on_delete=models.CASCADE, null=True, blank=True)
    plano_terapeutico = models.ForeignKey("Plano_terapeutico", on_delete=models.CASCADE, null=True, blank=True)

    def sessao_atual(self):
        return Sessao.objects.filter(paciente=self).order_by("-criada_em").first()

    def historico_atual(self):
        return Registro.objects.filter(
            paciente=self,
            sessao=self.sessao_atual()).order_by('-criado_em')
    
    def historico_completo(self):
        # Obs.: verificar se não eh melhor ordenar por sessao ou por timestamp
        return Registro.objects.filter(paciente=self).order_by('-criado_em')
    
    # Sempre que alterar o estagio do paciente, criar o respectivo Registro
    def atualizar(self, usuario, estagio, mensagem):
        self.estagio_atual = estagio
        self.save()
        r = Registro(
            paciente=self,
            usuario=usuario,
            sessao=self.sessao_atual(),
            estagio_atual=estagio,
            mensagem=mensagem,
            )
        r.save()

    def criar_prescricao(self, usuario):
        s = Sessao(paciente=self, numero=0)
        s.save()
        self.atualizar(usuario=usuario, estagio='PRESCRICAO_CRIADA', mensagem="Prescrição criada!")


    def __str__(self):
        return f"Paciente {self.nome}"

class Leito(models.Model):
    numero = models.CharField(max_length=16)
    ocupado = models.BooleanField(default=False, editable=False)

    def __str__(self):
        return f"Leito {self.numero}"

class Sessao(models.Model):
    paciente = models.ForeignKey("Paciente", on_delete=models.CASCADE, editable=False)
    numero = models.IntegerField()
    leito = models.ForeignKey("Leito", on_delete=models.CASCADE, null=True, blank=True, editable=False)
    data_internacao = models.DateTimeField(null=True, blank=True)
    data_alta = models.DateTimeField(null=True, blank=True, editable=False)
    def agora():
        return datetime.now()
    criada_em = models.DateTimeField(editable=False, default=agora)

    def __str__(self):
        return f"Sessao criada em {self.criada_em}"

class Registro(models.Model):
    # Quem eh o paciente?
    paciente = models.ForeignKey("Paciente", on_delete=models.CASCADE, editable=False)
    # Quem fez o registro?
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, editable=False)
    # De qual internacao estamos falando?
    sessao = models.ForeignKey("Sessao", on_delete=models.CASCADE, editable=False)
    # Qual eh o estagio atual do paciente?
    estagio_atual = models.CharField(max_length=128, choices=EstagioEnum.choices, editable=False)
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

    def __str__(self):
        return f"{self.sessoes_prescritas} sessoes a cada {self.dias_intervalo} dia(s)"
