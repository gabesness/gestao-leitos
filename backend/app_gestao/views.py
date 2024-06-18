from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from app_gestao.models import Paciente, Registro, Sessao, Plano_terapeutico
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
#from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from rest_framework.viewsets import ModelViewSet, GenericViewSet
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema, PolymorphicProxySerializer
from .serializers import *

# Create your views here.
class PacienteViewSet(GenericViewSet):
    queryset = Paciente.objects.all()
    serializer_class = PacienteSerializer

    @extend_schema(
            summary="Todos os pacientes",
            description="Lista de todos os pacientes, incluindo os falecidos, transferidos e com alta definitiva"
        )
    @action(detail=False, methods=['GET'], url_path='lista')
    def todos(self, request):
        queryset = self.get_queryset()
        fds = ['id', 'nome', 'prontuario', 'estagio_atual']
        serializer = self.get_serializer(queryset, many=True, fields=fds)
        return Response(serializer.data)
        queryset = self.get_object()
        serializer = self.get_serializer(queryset)
        return Response(serializer.data)

    @extend_schema(
        summary="Pacientes do médico",
        description="Pacientes com os estágios de prescrição criada, devolvido (pela farmácia ou regulação) e internado",
    )
    @action(detail=False, methods=['GET'])
    def lista_medico(self, request):
        estagios = [
            'PRESCRICAO_CRIADA',
            'DEVOLVIDA_PELA_FARMACIA',
            'DEVOLVIDA_PELA_REGULACAO',
            'INTERNADO',
            ]
        queryset = self.get_queryset().filter(estagio_atual__in=estagios)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @extend_schema(
        summary="Pacientes da farmácia",
        description="Pacientes com o estágio de encaminhado para a farmácia",
    )
    @action(detail=False, methods=['GET'])
    def lista_farmacia(self, request):
        queryset = self.get_queryset().filter(estagio_atual='ENCAMINHADO_PARA_FARMACIA')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @extend_schema(
        summary="Pacientes da regulação",
        description="Pacientes com os estágios de encaminhado para agendamento, agendado e autorizado para transferência",
    )
    @action(detail=False, methods=['GET'])
    def lista_regulacao(self, request):
        estagios = [
            'ENCAMINHADO_PARA_AGENDAMENTO',
            'AGENDADO',
            'AUTORIZADO_PARA_TRANSFERENCIA',
            ]
        queryset = self.get_queryset().filter(estagio_atual__in=estagios)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @extend_schema(
            summary="Cadastro de paciente",
            description="Cria o paciente no sistema. Obs.: O estágio atual de pacientes criados sempre é CADASTRADO"
    )
    @action(detail=False, methods=['POST'])
    def cadastrar_paciente(self, request):
        try:
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)})
        
    @extend_schema(
        summary="***INCOMPLETA*** Alteração de paciente",
        description="[INCOMPLETA] Permite editar o nome do paciente",
    )
    @action(detail=True, methods=['PUT'])
    def editar_paciente(self, request, pk=None):
        paciente = self.get_object()
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @extend_schema(
            summary="Histórico da sessão atual",
            description="Busca pelos Registros de um paciente referentes à sua sessão mais recente",
    )
    @action(detail=True, methods=['GET'])
    def historico_atual(self, request, pk=None):
        paciente = self.get_object()
        serializer = self.get_serializer(paciente)
        return Response(serializer.data['historico_atual'])

    @extend_schema(
            summary="Histórico completo do paciente",
            description="Retorna todos os Registros referentes a um paciente."
    )
    @action(detail=True, methods=['GET'])
    def historico_completo(self, request, pk=None):
        paciente = self.get_object()
        serializer = self.get_serializer(paciente)
        return Response(serializer.data['historico_completo'])
    
    @extend_schema(
        summary="Prescrição do paciente",
        description="Retorna a sessão atual, o histórico atual do paciente e também o seu plano terapêutico."
    )
    @action(detail=True, methods=['GET'])
    def consultar_prescricao(self, request, pk=None):
        fds = ['sessao_atual','historico_atual', 'plano_terapeutico']
        paciente = self.get_object()
        serializer = self.get_serializer(paciente, fields=fds)
        return Response(serializer.data, status=status.HTTP_200_OK)

class PrescricaoViewSet(GenericViewSet):
    queryset = Paciente.objects.all()
    serializer_class = PacienteSerializer

    @extend_schema(
        summary="Criar prescrição do paciente",
        description="""Altera o estado do paciente para PRESCRICAO_CRIADA (APENAS se o estagio_atual for CADASTRADO ou ALTA_NORMAL);
                       cria uma sessao nova para ele;
                       cria um Registro""",
        request=None
    )
    @action(detail=True, methods=['PATCH'])
    def criar_prescricao(self, request, pk=None):
        paciente = self.get_object()
        serializer = self.get_serializer(paciente)
        estagios_aceitos = ['CADASTRADO', 'ALTA_NORMAL']
        if serializer.data['estagio_atual'] in estagios_aceitos:
            serializer.criar_prescricao(obj=paciente, usuario=request.user)
            return Response(serializer.data['historico_atual'], status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'erro': 'estagio_atual inválido'},status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        summary="*WIP* Enviar prescrição do médico para a Farmácia",
        description="""O médico encaminha a prescrição para a farmácia, tanto faz se é a primeira vez ou se é depois de uma devolução.""",
        request=PrescricaoSerializer
        )
    @action(detail=True, methods=['PATCH'])
    def encaminhar_farmacia(self, request, pk=None):
        paciente = self.get_object()
        serializer = self.get_serializer(paciente)
        estagios_aceitos = ['PRESCRICAO_CRIADA', 'DEVOLVIDA_PELA_FARMACIA']
        if serializer.data['estagio_atual'] in estagios_aceitos:
            serializer.atualizar(obj=paciente, usuario=request.user, estagio='ENCAMINHADO_PARA_FARMACIA', mensagem=request.data['mensagem'])
            return Response({'OK': 'enviado com sucesso'}, status=status.HTTP_200_OK)
        else:
            return Response({'erro': 'estagio_atual invalido'}, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        summary="*WIP* Devolução da prescrição pela Farmácia",
        description="""Farmácia devolve para o médico corrigir e reenviar;
                       Altera o estágio do paciente para DEVOLVIDA_PELA_FARMACIA;
                       Cria o registro."""
    )
    @action(detail=True, methods=['PUT'])
    def devolver_farmacia(self, request, pk=None):
        pass

    @extend_schema(
        summary="*WIP* Devolução da prescrição pela Regulação",
        description="""A Regulação devolve a prescrição para o médico, solicitando autorização de transferência.
                       Altera o estágio do paciente para DEVOLVIDA_PELA_REGULACAO.
                       Cria o registro."""
    )
    @action(detail=True, methods=['PUT'])
    def devolver_regulacao(self, request, pk=None):
        pass


class UserViewSet(GenericViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    @extend_schema(
        summary="Todos os usuários",
        description="Lista todos os usuários no sistema"
    )
    @action(detail=False, methods=['GET'], url_path='')
    def lista(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    # @extend_schema(
    #         summary="Cadastrar usuário",
    #         description="Realiza o cadastro do usuário (Falta implementar envio de senha por e-mail)"
    # )
    # @action(detail=False, methods=['POST'])
    # def criar_usuario(self, request):
    #     serializer = self.get_serializer(data=request.data)
    #     if serializer.is_valid(raise_exception=True):
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)

### ROTAS DE LOGIN / AUTENTICACAO


@csrf_exempt
def fazer_login(request):
    try:
        username = request.POST.get("username", '')
        password = request.POST.get("password", '')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            data = {
                'id': user.id,
                'username': user.username,
                'nome': user.first_name,
                'sobrenome': user.last_name,
                'email': user.email,
                'groups': list(user.groups.values_list('name', flat=True)),
            }
            return JsonResponse(data)
        else:
            return JsonResponse({"erro": "usuario/senha incorretos"})
    except Exception as e:
        return JsonResponse({"erro": str(e)})

def esqueceu_senha(request):
    email = request.POST.get('email', '')
    # enviar o email lol
    return HttpResponse(status=200)

def alterar_senha(request, id):
    user = User.objects.get(id)
    senha = request.PUT.get('senha', '')
    confirmar_senha = request.POST.get('confirmar_senha', '')
    if senha == confirmar_senha:
        user.set_password(senha)
        user.save()
        # alterar a senha do usuario
        pass
    pass

# ROTAS DO MEDICO
    try:
        prontuario = request.PUT.get('prontuario', '')
        p = Paciente.objects.get(prontuario=prontuario)
        if p.estagio_atual == 'CADASTRADO': # Somente permitir para pacientes sem prescricao
            p.estagio_atual = 'PRESCRICAO_CRIADA'
            p.save()

            s = Sessao(leito=None, paciente=p, data_internacao=None, data_alta=None)
            s.save()

            r = Registro(paciente=p, usuario=request.user, sessao=s, estagio_atual=p.estagio_atual, mensagem='Prescrição do paciente criada!')
            r.save()

            return JsonResponse({'OK': 'Prescrição criada com sucesso!'})


        else:
            return JsonResponse({'erro': 'Este paciente já possui prescrição cadastrada'})
    except Exception as e:
        return JsonResponse({'erro': str(e)})
def encaminhar_farmacia(request, id_paciente): ### WIP
    try:
        p = Paciente.objects.get(id=id_paciente) # Quem eh o paciente?
        numero_sessoes = request.PUT.get('numero_sessoes', '')
        dias_intervalo = request.PUT.get('dias_intervalo', '')
        medicamentos = request.PUT.get('medicamentos', '')
        data_sugerida = request.PUT.get('data_entrada', '')
        msg = request.PUT.get('mensagem', '')
        # Caso nao haja plano terapeutico, criar um novo e associar ao paciente
        if p.plano_terapeutico is None:

            pt = Plano_terapeutico(
                sessoes_prescritas=numero_sessoes,
                sessoes_restantes=numero_sessoes,
                dias_intervalo=dias_intervalo,
                medicamentos=medicamentos,
                data_sugerida=data_sugerida)
            
            pt.save()

            p.plano_terapeutico = pt
        
        # Caso ja haja plano terapeutico, alterar...
        else:
            pt = p.plano_terapeutico
            if numero_sessoes: pt.sessoes_prescritas = numero_sessoes
            if dias_intervalo: pt.dias_intervalo = dias_intervalo
            if medicamentos: pt.medicamentos = medicamentos
            if data_sugerida: pt.data_sugerida = data_sugerida


            
        p.estagio_atual = 'ENCAMINHADO_PARA_FARMACIA'
        p.save()

        r = Registro(paciente=p,
                     #sessao=sessao_atual(id_paciente),
                     usuario=request.user,
                     estagio_atual=p.estagio_atual,
                     mensagem=msg)
        
        r.save()

        return JsonResponse({'OK': 'enviado para a farmacia'})


    except Exception as e:
        return JsonResponse({'erro': str(e)})

# ROTAS GERAIS
def minha_conta(request, id):
    try:
        user = User.objects.filter(id=id).values()
        return JsonResponse(list(user), safe=False)
    except Exception as e:
        return JsonResponse({"erro": str(e)})
def dashboard(request):
    pass
def alterar_dados_do_usuario(request, id):
    try:
        nome = request.PUT.get('first_name', '')
        sobrenome = request.PUT.get('last_name', '')
        email = request.PUT.get('email', '')
        if nome: u.first_name = nome
        if sobrenome: u.last_name = sobrenome
        if email: u.email = email
        u = User.objects.get(id=id)
        return JsonResponse({"OK": "dados alterados com sucesso!"})
    except Exception as e:
        return JsonResponse({"erro": str(e)})

