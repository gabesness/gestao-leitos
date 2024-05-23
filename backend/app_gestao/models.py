from django.db import models
from datetime import datetime

# Enumerator para os estagios que o paciente pode ter no sistema
# Verificar se essas classes podem ficar no escopo local de cada classe que vai utilizar

class Cargo(models.TextChoices):
    ADMIN = "Administrador"
    MEDICO = "Medico"
    FARMACIA = "Farmacia"
    REGULACAO = "Regulacao"
    RECEPCIONISTA = "Recepcionista"

class Estagio(models.TextChoices):
    CADASTRADO = "Paciente cadastrado" # Paciente cadastrado
    PRESCRICAO_CRIADA = "Prescrição criada" # Prescricao criada
    PRESCRICAO_DEVOLVIDA_PELA_FARMACIA = "Prescrição devolvida pela Farmácia para o médico" # Prescricao devolvida ao medico pela farmacia para alteracao de medicamentos
    PRESCRICAO_DEVOLVIDA_PELA_REGULACAO = "Prescrição devolvida pela Regulação para o médico" # Prescricao devolvida ao medico pela regulacao para autorizacao de encaminhamento
    ENCAMINHADO_PARA_FARMACIA = "Prescrição encaminhada para a Farmácia" # Paciente encaminhado para a farmacia
    ENCAMINHADO_PARA_AGENDAMENTO = "Prescrição encaminhada para agendamento" # Encaminhado para a Regulacao agendar o paciente
    AUTORIZADO_PARA_TRANSFERENCIA = "Paciente autorizado para transferência" # Paciente autorizado pelo medico para ser transferido para outro hospital, pendente conf. pela regulacao
    TRANSFERIDO = "Paciente transferido para outro hospital" # Transferido para outro hospital
    AGENDADO = "Internação agendada" # Paciente com internacao agendada
    INTERNADO = "Paciente internado"
    ALTA_OBITO = "Paciente falecido"
    ALTA_NORMAL = "Paciente com alta registrada"
    ALTA_DEFINITIVA = "Paciente com alta definitiva registrada"


class Usuario(models.Model):
    matricula = models.CharField(max_length=4, unique=True)
    senha = models.CharField(max_length=6)
    email = models.EmailField()
    telefone = models.CharField(max_length=11, blank=True)  
    cargo = models.CharField(max_length=16, choices=Cargo.choices)

# class Administrador(Usuario):



class Paciente(models.Model):
    prontuario = models.CharField(max_length=15, unique=True)
    nome = models.CharField(max_length=256)
    estagio_atual = models.CharField(max_length=128, choices=Estagio.choices, default=Estagio.CADASTRADO)
    #prescricao_atual = models.ForeignKey("Plano_terapeutico", on_delete=models.CASCADE, null=True)

    def __str__(self):
        return f"Paciente [nome={self.nome}]"

class Leito(models.Model):
    numero = models.CharField(max_length=16)
    ocupado = models.BooleanField()
    paciente = models.ForeignKey("Paciente", on_delete=models.CASCADE, null=True)

    def __str__(self):
        return f"Leito [numero={self.numero}]"

#class Prescricao(models.Model):


class Sessao(models.Model):
    leito = models.ForeignKey("Leito", on_delete=models.CASCADE, null=True)
    paciente = models.ForeignKey("Paciente", on_delete=models.CASCADE)
    data_internacao = models.DateTimeField()
    data_alta = models.DateTimeField(null=True)

class Registro(models.Model):
    # Quem eh o paciente?
    paciente = models.ForeignKey("Paciente", on_delete=models.CASCADE)
    # Quem fez o registro?
    usuario = models.ForeignKey("Usuario", on_delete=models.CASCADE)
    # De qual internacao estamos falando?
    sessao = models.ForeignKey("Sessao", on_delete=models.CASCADE)
    # Qual eh o estagio atual do paciente?
    estagio_atual = models.CharField(max_length=128, choices=Estagio.choices)
    # Qual eh a mensagem?
    mensagem = models.TextField()

    def agora():
        return datetime.now()
    
    criado_em = models.DateTimeField(editable=False, default=agora)

    def __str__(self):
        return f"Registro [estagio={self.estagio_atual}], [mensagem={self.mensagem}]"

class Plano_terapeutico(models.Model):
    paciente = models.ForeignKey("Paciente", on_delete=models.CASCADE)
    dias_internado = models.IntegerField()
    dias_intervalo = models.IntegerField()
    numero_sessoes = models.IntegerField()
    data_sugerida = models.DateField()
    medicamentos = models.CharField(max_length=280)
