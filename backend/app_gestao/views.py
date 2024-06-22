from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from app_gestao.models import Paciente, Registro, Sessao, Plano_terapeutico
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
#from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.shortcuts import get_object_or_404
from rest_framework.viewsets import ModelViewSet, GenericViewSet
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema, PolymorphicProxySerializer
from drf_spectacular.types import OpenApiTypes
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
            'DEVOLVIDO_PELA_FARMACIA',
            'DEVOLVIDO_PELA_REGULACAO',
            'INTERNADO',
            'ALTA_NORMAL',
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
            'ALTA_NORMAL',
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
                return Response({'OK': 'Paciente cadastrado com sucesso!'}, status=status.HTTP_201_CREATED)
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
        description="""Requer o prontuário do paciente;
                       Altera o estado do paciente para PRESCRICAO_CRIADA (APENAS se o estagio_atual for CADASTRADO ou ALTA_NORMAL);
                       cria uma sessao nova para ele;
                       cria um Registro""",
        request=None,
    )
    @action(detail=False, methods=['PATCH'], url_path='(?P<prontuario>[^/.]+)/criar_prescricao')
    def criar_prescricao(self, request, prontuario):
        try:
            paciente = self.get_queryset().get(prontuario=prontuario)
        except Paciente.DoesNotExist:
            return Response({'erro': 'Paciente não encontrado'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(paciente)
        estagios_aceitos = ['CADASTRADO', 'ALTA_NORMAL']
        if serializer.data['estagio_atual'] in estagios_aceitos:
            serializer.criar_prescricao(obj=paciente)
            serializer.atualizar_estagio(obj=paciente, usuario=request.user, estagio='PRESCRICAO_CRIADA', mensagem='Prescrição criada!')
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'erro': 'estagio_atual inválido'},status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        summary="*WIP* Enviar prescrição do médico para a Farmácia",
        description="""O médico encaminha a prescrição para a farmácia (devolvida ou não);
                       Assume o estágio atual do paciente é PRESCRICAO_CRIADA ou DEVOLVIDO_PELA_FARMACIA;
                       Altera o estágio atual do paciente para ENCAMINHADO_PARA_FARMACIA;
                       Caso o paciente não possua plano terapêutico, é criado um plano novo e atribuído ao paciente;
                       Caso já possua, o plano é apenas alterado;
                       Cria um Registro.""",
        request=PrescricaoSerializer # recebe um atributo Plano_terapeutico e um atributo mensagem
        )
    @action(detail=True, methods=['PATCH'])
    def encaminhar_farmacia(self, request, pk=None):
        plano_json = request.data['plano_terapeutico']
        paciente = self.get_object()
        paciente_serializer = self.get_serializer(paciente)
        estagios_aceitos = ['PRESCRICAO_CRIADA', 'DEVOLVIDO_PELA_FARMACIA']
        
        if paciente_serializer.data['estagio_atual'] in estagios_aceitos:
            # Se não houver nenhum plano terapeutico associado ao paciente, criar um plano novo
            if paciente.plano_terapeutico is None:
                # Definindo um novo plano terapeutico
                plano_serializer = Plano_terapeuticoSerializer(data={**plano_json, 'sessoes_restantes': plano_json['sessoes_prescritas']})
                if plano_serializer.is_valid(): # checando as informacoes do plano novo
                    plano_terapeutico = plano_serializer.create({**plano_json, 'sessoes_restantes': plano_json['sessoes_prescritas']})
                    plano_terapeutico.save() # salva o novo plano no banco de dados
                    paciente_serializer.associar_plano(obj=paciente, plano_terapeutico=plano_terapeutico)
                else:
                    return Response({plano_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
            # Se já houver plano para esse paciente, recuperar o existente e alterar as suas informações
            else:
                plano_serializer = paciente_serializer.data['plano_terapeutico'] # consulta o plano terapeutico do paciente
                plano_terapeutico = plano_serializer.update(obj=Plano_terapeutico.objects.get(id=plano_serializer.data['id']), validated_data=plano_json)
        
            paciente_serializer.atualizar_estagio(obj=paciente, usuario=request.user, estagio='ENCAMINHADO_PARA_FARMACIA', mensagem=request.data['mensagem'])
            return Response({'OK': 'Plano terapeutico criado e paciente encaminhado aa Farmacia'}, status=status.HTTP_200_OK)
        else:
            return Response({'erro': 'estagio_atual invalido'}, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
            summary="Encaminhar para agendamento",
            description="""Envio do paciente da Farmácia para a regulação;
                           Assume que o paciente está no estágio de ENCAMINHADO_PARA_FARMACIA;
                           Cria o Registro.""",
            request={'application/json': {'mensagem': 'string'}}
    )
    @action(detail=True, methods=['PATCH'])
    def encaminhar_agendamento(self, request, pk=None):
        paciente = self.get_object()
        serializer = self.get_serializer(paciente)
        if serializer.data['estagio_atual'] == 'ENCAMINHADO_PARA_FARMACIA':
            serializer.atualizar_estagio(
                obj=paciente, 
                usuario=request.user, 
                estagio='ENCAMINHADO_PARA_AGENDAMENTO',
                mensagem=request.data)
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'erro': 'Estágio atual inválido'}, status=status.HTTP_400_BAD_REQUEST)
        
    @extend_schema(
            summary="*WIP* Agendar paciente",
            description="""Recebe como parâmetro o leito;
                           Assume o estágio atual do paciente como ENCAMINHADO_PARA_AGENDAMENTO;
                           Assume que o leito está livre (FALTA IMPLEMENTAR!);
                           Marca o leito como ocupado e coloca-o no campo 'leito' do paciente;
                           Cria o registro.""",
            request=None,
    )
    @action(detail=True, methods=['PATCH'], url_path='(?P<id_leito>[^/.]+)/agendar_paciente')
    def agendar_paciente(self, request, pk=None, id_leito=None):
        paciente = self.get_object()
        serializer = self.get_serializer(paciente)
        if serializer.data['estagio_atual'] == 'ENCAMINHADO_PARA_AGENDAMENTO':
            serializer.alocar_leito(obj=paciente, id_leito=id_leito)
            serializer.atualizar_estagio(
                obj=paciente,
                usuario=request.user,
                estagio='AGENDADO',
                mensagem=f"Paciente agendado para internação."
                )
            return Response({'OK': 'Agendado com sucesso'}, status=status.HTTP_200_OK)
        else:
            return Response({'erro': 'estagio_atual inválido'}, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
            summary="Internar paciente",
            description="""Coloca a data de internação na sessão atual do paciente;
                           Assume estágio AGENDADO.
                           """,
            request=None,
    )
    @action(detail=True, methods=['PATCH'])
    def internar(self, request, pk=None):
        paciente = self.get_object()
        serializer = self.get_serializer(paciente)
        if serializer.data['estagio_atual'] == 'AGENDADO':
            serializer.internar(obj=paciente)
            serializer.atualizar_estagio(usuario=request.user, estagio='INTERNADO', mensagem="Paciente internado.")
            return Response({'OK': 'Paciente internado com sucesso!'}, status=status.HTTP_200_OK)
        else:
            return Response({'erro': 'estagio_atual invalido'}, status=status.HTTP_400_BAD_REQUEST)
        
    @extend_schema(
            summary="Dar alta",
            description="""Recebe um parâmetro 'tipo_alta': string;
                           tipo_alta: N - normal, D - definitiva, ou O - óbito;
                           Retira a chave estrangeira de leito do paciente;
                           Coloca a data de alta na sessão atual;
                           Assume os estágios: INTERNADO ou AGENDADO.""",
            request={'application/json': {'tipo_alta': 'string'}}
    )
    @action(detail=True, methods=['PATCH'])
    def dar_alta(self, request, pk=None):
        paciente = self.get_object()
        estagios_aceitos = ['AGENDADO', 'INTERNADO']
        if paciente.estagio_atual in estagios_aceitos:
            alta = request
            if alta == 'N': # alta normal
                paciente.dar_alta()
                paciente.atualizar_estagio(usuario=request.user, estagio='ALTA_NORMAL', mensagem="Paciente com alta.")
            elif alta == 'D': # alta definitiva
                paciente.dar_alta()
                paciente.atualizar_estagio(usuario=request.user, estagio='ALTA_DEFINITIVA', mensagem="Paciente com alta definitiva.")
            elif alta == 'O': # alta óbito
                paciente.dar_alta()
                paciente.atualizar_estagio(usuario=request.user, estagio='ALTA_OBITO', mensagem="Registrado o óbito do paciente nesta data.")
            else:
                return Response({'erro': 'tipo de alta não definido'}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'OK': 'Alta registrada com sucesso!'}, status=status.HTTP_200_OK)
        else:
            return Response({'erro': 'estagio_atual inválido'}, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        summary="Devolução da prescrição (Farmácia)",
        description="""Farmácia devolve para o médico corrigir e reenviar;
                       Altera o estágio do paciente para DEVOLVIDA_PELA_FARMACIA;
                       Cria o registro.""",
        request={'application/json': {'mensagem': 'string'}}
    )
    @action(detail=True, methods=['PATCH'])
    def devolver_farmacia(self, request, pk=None):
        paciente = self.get_object()
        serializer = self.get_serializer(paciente)
        if serializer.data['estagio_atual'] == 'ENCAMINHADO_PARA_FARMACIA':
            serializer.atualizar_estagio(obj=paciente, usuario=request.user, estagio='DEVOLVIDO_PELA_FARMACIA', mensagem=request.data)
            return Response({'OK': 'devolvido com sucesso'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'erro': 'estagio_atual invalido'}, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        summary="Devolução da prescrição (Regulação)",
        description="""A Regulação devolve a prescrição para o médico, solicitando autorização de transferência.
                       Altera o estágio do paciente para DEVOLVIDA_PELA_REGULACAO.
                       Cria o registro.""",
        request={'application/json': {'mensagem': 'string'}},
    )
    @action(detail=True, methods=['PATCH'])
    def devolver_regulacao(self, request, pk=None):
        paciente = self.get_object()
        serializer = self.get_serializer(paciente)
        estagios_aceitos = ['ENCAMINHADO_PARA_AGENDAMENTO', 'AUTORIZADO_PARA_TRANSFERENCIA']
        if serializer.data['estagio_atual'] in estagios_aceitos:
            serializer.atualizar_estagio(obj=paciente, usuario=request.user, estagio='DEVOLVIDO_PELA_REGULACAO', mensagem=request.data)
            return Response({'OK': 'devolvido com sucesso'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'erro': 'estagio_atual invalido'}, status=status.HTTP_400_BAD_REQUEST)
    
    @extend_schema(
        summary="Autorização de transferência",
        description="""O médico recebe a solicitação de transferência da Regulação e faz a autorização;
                       A prescrição retorna para a Regulação;
                       Altera o estágio atual do paciente para AUTORIZADO_PARA_TRANSFERENCIA;
                       Cria o registro""",
        request={'application/json': {'mensagem': 'string'}}
    )
    @action(detail=True, methods=['PATCH'])
    def autorizar_transferencia(self, request, pk=None):
        paciente = self.get_object()
        serializer = self.get_serializer(paciente)
        if serializer.data['estagio_atual'] == 'DEVOLVIDO_PELA_REGULACAO':
            serializer.atualizar_estagio(obj=paciente, usuario=request.user, estagio='AUTORIZADO_PARA_TRANSFERENCIA', mensagem=request.data)
            return Response({'OK': 'devolvido com sucesso'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'erro': 'estagio_atual invalido'}, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(
        summary="Confirmação de transferência",
        description="""Regulação confirma a transferência, efetivamente removendo o paciente do fluxo de internação;
                       Altera o estágio atual do paciente para TRANSFERIDO;
                       Cria o registro;
                       A partir desse momento, não é possível mais interagir com esse paciente, apenas efetuar consultas.""",
        request={'application/json': {'mensagem': 'string'}}
    )
    @action(detail=True, methods=['PATCH'])
    def transferir(self, request, pk=None):
        paciente = self.get_object()
        serializer = self.get_serializer(paciente)
        if serializer.data['estagio_atual'] == 'AUTORIZADO_PARA_TRANSFERENCIA':
            serializer.atualizar_estagio(obj=paciente, usuario=request.user, estagio='TRANSFERIDO', mensagem=request.data)
            return Response({'OK': 'devolvido com sucesso'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'erro': 'estagio_atual invalido'}, status=status.HTTP_400_BAD_REQUEST)



class LeitoViewSet(GenericViewSet):
    queryset = Leito.objects.all()
    serializer_class = LeitoSerializer

    @extend_schema(
        summary="Todos os leitos",
        description="Retorna todos os leitos no sistema"
    )
    @action(detail=False, methods=['GET'], url_path='lista')
    def todos(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
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

