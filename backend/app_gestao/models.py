from django.db import models

# Enumerator para os estagios que o paciente pode ter no sistema
# Verificar se essas classes podem ficar no escopo local de cada classe que vai utilizar

class Cargo(models.TextChoices):
    ADMIN = "Administrador"
    MEDICO = "Medico"
    FARMACIA = "Farmacia"
    REGULACAO = "Regulacao"
    RECEPCIONISTA = "Recepcionista"

class Estagio(models.TextChoices):
    CADASTRADO = "Paciente cadastrado"
    PRESCRICAO_CRIADA = "Prescricao criada"
    PRESCRICAO_DEVOLVIDA = "Prescricao devolvida ao medico"
    ENC_FARMACIA = "Encaminhado para a Farmacia"
    ENC_REGULACAO = "Encaminhado para a Regulacao"
    ENC_HOSPITAL = "Encaminhado para outro hospital"
    INTERNADO = "Internado"
    ALTA_OBITO = "Alta obito"
    ALTA_NORMAL = "Alta normal"
    ALTA_DEFINITIVA = "Alta definitiva"


class Usuario(models.Model):
    matricula = models.CharField(max_length=4, unique=True)
    senha = models.CharField(max_length=6)
    email = models.EmailField()
    telefone = models.CharField(max_length=11, blank=True)  
    cargo = models.CharField(max_length=16, choices=Cargo.choices)

# class Administrador(Usuario):



class Paciente(models.Model):
    prontuario = models.CharField(max_length=15)
    nome = models.CharField(max_length=256)
    internacao_atual = models.ForeignKey("Internacao", on_delete=models.CASCADE)
    estagio_atual = models.CharField(max_length=32, choices=Estagio.choices, default=Estagio.CADASTRADO)
    prescricao_atual = models.ForeignKey("Plano_terapeutico", on_delete=models.CASCADE)

class Leito(models.Model):
    numero = models.CharField(max_length=5)
    ocupado = models.BooleanField()
    paciente = models.ForeignKey("Paciente", on_delete=models.CASCADE)

#class Prescricao(models.Model):


class Internacao(models.Model):
    #paciente = models.ForeignKey("Paciente", on_delete=models.CASCADE)
    leito = models.ForeignKey("Leito", on_delete=models.CASCADE)
    data_internacao = models.DateTimeField()
    data_alta = models.DateTimeField()

class Registro(models.Model):
    # Quem eh o paciente?
    id_paciente = models.ForeignKey("Paciente", on_delete=models.CASCADE)
    # Quem fez o registro?
    id_usuario = models.ForeignKey("Usuario", on_delete=models.CASCADE)
    # De qual internacao estamos falando?
    id_internacao = models.ForeignKey("Internacao", on_delete=models.CASCADE)
    # Qual eh a mensagem?
    mensagem = models.CharField(max_length=10)

class Plano_terapeutico(models.Model):
    dias_internado = models.IntegerField()
    dias_intervalo = models.IntegerField()
    numero_sessoes = models.IntegerField()
    data_sugerida = models.DateField()
    medicamentos = models.CharField(max_length=280)
