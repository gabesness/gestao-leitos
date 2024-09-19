from django.db import models
from datetime import datetime, timedelta
from django.contrib.auth.models import User
from django.utils import timezone
from .helpers import estagio_to_readable

from collections import defaultdict

class EstagioEnum(models.TextChoices):
    CADASTRADO = "CADASTRADO" # Paciente cadastrado
    PRESCRICAO_CRIADA = "PRESCRICAO_CRIADA" # Prescricao criada
    PRESCRICAO_DEVOLVIDA_PELA_FARMACIA = "DEVOLVIDO_PELA_FARMACIA" # Prescricao devolvida ao medico pela farmacia para alteracao de medicamentos
    PRESCRICAO_DEVOLVIDA_PELA_REGULACAO = "DEVOLVIDO_PELA_REGULACAO" # Prescricao devolvida ao medico pela regulacao para autorizacao de encaminhamento
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

    #@property
    def sessao_atual(self):
        return Sessao.objects.filter(paciente=self).order_by("-criada_em").first()
    
    def numero_sessao_atual(self):
        # A sessao atual eh sempre a ultima sessao, logo seu numero eh a quantidade de sessoes que existem para o paciente
        return Sessao.objects.filter(paciente=self).count()

    #@property
    def historico_atual(self):
        registros = Registro.objects.filter(
            paciente=self,
            sessao=self.sessao_atual()).order_by('-criado_em')
        
        for registro in registros:
            registro.estagio_atual = estagio_to_readable(registro.estagio_atual)
        
        return registros
    
    #@property
    def historico_completo(self):
        # Obs.: verificar se não eh melhor ordenar por sessao ou por timestamp
        registros = Registro.objects.filter(paciente=self).order_by('-criado_em')
        for registro in registros:
            registro.estagio_atual = estagio_to_readable(registro.estagio_atual)
        
        return registros
    
    # Sempre que alterar o estagio do paciente, criar o respectivo Registro
    # APENAS altera o estagio, deve ser chamada em conjunto com os demais metodos
    def atualizar_estagio(self, usuario, estagio, mensagem):
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

 # ==============================================================================
    # Os metodos abaixo lidam com a logica interna do sistema, criando e atualizando outras tabelas
    # Apos chama-los, NECESSARIO chamar tambem o metodo atualizar_estagio()

    def criar_prescricao(self):
        s = Sessao(paciente=self)
        s.save()
        self.save()
    
    def associar_plano(self, plano_terapeutico):
        self.plano_terapeutico = plano_terapeutico
        self.save()

    def alocar_leito(self, id_leito):
        leito = Leito.objects.get(id=id_leito)
        self.leito = leito
        leito.ocupado = True
        leito.save()
        self.save()

    def desalocar_leito(self):
        leito = self.leito
        leito.ocupado = False
        self.leito = None
        leito.save()
        self.save()
    
    def internar(self):
        s = self.sessao_atual()
        s.data_internacao = timezone.now()
        s.save()
        self.save()

    def dar_alta(self):
        self.desalocar_leito()
        s = self.sessao_atual()
        s.data_alta = timezone.now()
        s.save()
        self.save()

    def __str__(self):
        return f"Paciente {self.nome}"

class Leito(models.Model):
    numero = models.CharField(max_length=16)
    ocupado = models.BooleanField(default=False, editable=False)

    def __str__(self):
        return f"Leito {self.numero}"

class Sessao(models.Model):
    paciente = models.ForeignKey("Paciente", on_delete=models.CASCADE)
    numero = models.IntegerField(default=None, editable=False)
    leito = models.ForeignKey("Leito", on_delete=models.CASCADE, null=True, blank=True, editable=False)
    data_internacao = models.DateTimeField(null=True, blank=True)
    data_alta = models.DateTimeField(null=True, blank=True, editable=False)
    def agora():
        return timezone.now()
    criada_em = models.DateTimeField(editable=False, default=agora)

    def gerar_numero(self, paciente):
        n = Sessao.objects.filter(paciente=paciente).count()
        return n + 1
    
    def save(self, *args, **kwargs):
        if self.numero is None:
            self.numero = self.gerar_numero(self.paciente)
        super().save(*args, **kwargs)

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
        return timezone.now()
    
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
    
class Estatisticas():
    data = {}

    def taxa_ocupacao(dias=None):
        pass

    def historico_altas(dias=None):  # OK
        """
        Mostra quantas altas tiveram por dia em determinado período de tempo, dividido por tipo de alta (Obito, Definitiva e Transferencia).
        """
        altas = ['ALTA_OBITO', 'ALTA_DEFINITIVA', 'TRANSFERIDO']
        queryset = Registro.objects.filter(estagio_atual__in=altas)
        if dias is not None:
            data_inicio = timezone.now() - timedelta(days=dias)
            queryset = queryset.filter(criado_em__gte=data_inicio)

        daily_counts = (queryset
                        .annotate(data=models.functions.TruncDate('criado_em'))
                        .values('data', 'estagio_atual')
                        .annotate(count=models.Count('id'))
                        .order_by('data', 'estagio_atual')
        )

        formatted_data = defaultdict(lambda: {alta: 0 for alta in altas})

        for item in daily_counts:
            str_data = item['data'].strftime('%d/%m/%Y')
            alta = item['estagio_atual']
            count = item['count']
            formatted_data[str_data][alta] = count

        result_list = [{'data': data, **counts} for data, counts in formatted_data.items()]

        return result_list

    def histograma_num_sessoes(dias=None):  # OK
        """
            Conta quantas sessoes teve cada paciente, e depois agrupa os pacientes por numero de sessao
            Ex.: Considere
                Joao - 3 sessoes,
                Maria - 4 sessoes,
                Lucas - 4 sessoes,
                Marcos - 5 sessoes,
                Elisa - 7 sessoes,
            O histograma ira condensar essas informacoes em algo como
                3 sessoes - 1 paciente,
                4 sessoes - 2 pacientes,
                5 sessoes - 1 paciente,
                7 sessoes - 1 paciente,
            Passo-a-passo:
            1. Conte o numero de sessoes que cada paciente teve;
            2. Considere o intervalo de 1 ate o numero maximo de sessoes encontrado;
            3. Para cada valor no intervalo, conte quantas vezes esse valor aparece.
        """
        ids_pacientes = Paciente.objects.all().values('id')
        numero_sessoes = []
        if dias is None:
            for pair in ids_pacientes:
                numero_sessoes.append(Sessao.objects.filter(data_alta__isnull=False, paciente_id=pair['id']).count())
        else:
            data_inicio = timezone.now() - timedelta(days=dias)
            for pair in ids_pacientes:
                numero_sessoes.append(Sessao.objects.filter(data_alta__gte=data_inicio, paciente_id=pair['id']).count())
        data = []
        for i in range(1, max(numero_sessoes)+1):
            s = "sessao" if i == 1 else "sessoes"
            data.append({f"{i} {s}": numero_sessoes.count(i)})

        return data

    def histograma_tempo_internacao(dias=None):  # OK
        """
            Semelhante ao histograma_numero_sessoes, porem dessa vez com o tempo de internacao\n
            Ex.:\n
                1 dia - 2 pacientes,\n
                2 dias - 3 pacientes,\n
                3 dias - 5 pacientes,\n
                4 dias - 0 pacientes,\n 
                ...\n
            Passo-a-passo:
            1. Calcule o tempo de internacao de cada Sessao;
            2. Considere o intervalo de 1 ate o tempo maximo de internacao encontrado;
            3. Para cada valor no intervalo, conte quantas vezes esse valor aparece.
        """
        queryset = Sessao.objects.filter(data_internacao__isnull=False, data_alta__isnull=False)

        if dias is not None:
            data_inicio = timezone.now() - timedelta(days=dias)
            queryset = queryset.filter(data_alta__gte=data_inicio)
        
        sessoes = list(queryset)
        tempos = []
        for sessao in sessoes:
            tempo = sessao.data_alta - sessao.data_internacao
            tempos.append(tempo.days+1)
            
        data = []
        for i in range(1, max(tempos)+1):
            d = "dia" if i == 1 else "dias"
            data.append({f"{i} {d}": tempos.count(i)})
        return data

    def pacientes_novos(dias=None):  # OK
        """
        Retorna quantos novos pacientes entraram no sistema por tempo.
        1. Considere os dias informados. Se dias=None, considere todo o período.
        2. Para cada dia dentro do intervalo, conte quantos Registros têm o status PACIENTE_CADASTRADO.
        3. Para intervalos acima de 30 dias, envie de n em n dias em vez de dias individuais.
        """
        
        queryset = Registro.objects.filter(estagio_atual="PRESCRICAO_CRIADA").distinct()
        if dias is not None:
            data_inicio = timezone.now() - timedelta(days=dias)
            queryset = queryset.filter(criado_em__gte=data_inicio)

        daily_counts = (queryset
                        .annotate(data=models.functions.TruncDate('criado_em'))
                        .values('data')
                        .annotate(count=models.Count('id'))
                        .order_by('data')
        )

        formatted_data = defaultdict()

        for item in daily_counts:
            str_data = item['data'].strftime('%d/%m/%Y')
            count = item['count']
            formatted_data[str_data] = count
        
        return formatted_data  
