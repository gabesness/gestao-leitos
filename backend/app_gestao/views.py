from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from app_gestao.models import Paciente, Registro, Sessao, Plano_terapeutico
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
#from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from rest_framework.viewsets import GenericViewSet
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema
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
        serializer = self.get_serializer(queryset, many=True)
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
            serializer = self.get_serializer(paciente)
            estagios_aceitos = ['CADASTRADO', 'ALTA_NORMAL']
            if request.user.is_authenticated:
                if serializer.data['estagio_atual'] in estagios_aceitos:
                    serializer.criar_prescricao(obj=paciente)
                    serializer.atualizar_estagio(obj=paciente, usuario=request.user, estagio='PRESCRICAO_CRIADA', mensagem='Prescrição criada!')
                    return Response(status=status.HTTP_204_NO_CONTENT)
                else:
                    return Response({'erro': 'estagio_atual inválido'},status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'Erro': 'usuário não autenticado'}, status=status.HTTP_401_UNAUTHORIZED)
        except Paciente.DoesNotExist:
            return Response({'erro': 'Paciente não encontrado'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'erro': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)  
    
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
        try:
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
                    plano_terapeutico = plano_serializer.update(obj=Plano_terapeutico.objects.get(id=plano_serializer['id']), validated_data=plano_json)
            
                paciente_serializer.atualizar_estagio(obj=paciente, usuario=request.user, estagio='ENCAMINHADO_PARA_FARMACIA', mensagem=request.data['mensagem'])
                return Response({'OK': 'Plano terapeutico criado e paciente encaminhado aa Farmacia'}, status=status.HTTP_200_OK)
            else:
                return Response({'erro': 'estagio_atual invalido'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'Erro': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @extend_schema(
            summary="Encaminhar para agendamento",
            description="""Envio do paciente da Farmácia para a regulação;
                           Assume que o paciente está no estágio de ENCAMINHADO_PARA_FARMACIA;
                           Cria o Registro.""",
            request={
        'application/json': {
            'type': 'object',
            'properties': {
                'mensagem': {
                    'type': 'string'
                }
            },
            'required': ['mensagem']
        }
    }
    )
    @action(detail=True, methods=['PATCH'])
    def encaminhar_agendamento(self, request, pk=None):
        try:
            paciente = self.get_object()
            serializer = self.get_serializer(paciente)
            if serializer.data['estagio_atual'] == 'ENCAMINHADO_PARA_FARMACIA':
                serializer.atualizar_estagio(
                    obj=paciente, 
                    usuario=request.user, 
                    estagio='ENCAMINHADO_PARA_AGENDAMENTO',
                    mensagem=request.data['mensagem'])
                return Response(status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({'erro': 'Estágio atual inválido'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'Erro': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @extend_schema(
            summary="Agendar paciente",
            description="""Recebe como parâmetro o id do leito;
                           Assume o estágio atual do paciente como ENCAMINHADO_PARA_AGENDAMENTO;
                           Assume que o leito está livre (FALTA IMPLEMENTAR!);
                           Marca o leito como ocupado e coloca-o no campo 'leito' do paciente;
                           Cria o registro.""",
            request=None,
    )
    @action(detail=True, methods=['PATCH'], url_path='agendar_paciente/(?P<id_leito>[^/.]+)')
    def agendar_paciente(self, request, pk=None, id_leito=None):
        try:
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
        except Exception as e:
            return Response({'Erro': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @extend_schema(
            summary="Internar paciente",
            description="""Coloca a data de internação na sessão atual do paciente;
                           Assume estágio AGENDADO.
                           """,
            request=None,
    )
    @action(detail=True, methods=['PATCH'])
    def internar(self, request, pk=None):
        try:
            paciente = self.get_object()
            serializer = self.get_serializer(paciente)
            if serializer.data['estagio_atual'] == 'AGENDADO':
                serializer.internar(obj=paciente)
                serializer.atualizar_estagio(obj=paciente, usuario=request.user, estagio='INTERNADO', mensagem="Paciente internado.")
                return Response({'OK': 'Paciente internado com sucesso!'}, status=status.HTTP_200_OK)
            else:
                return Response({'erro': 'estagio_atual invalido'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'Erro': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    @extend_schema(
            summary="Dar alta",
            description="""Recebe um parâmetro 'tipo_alta' na URL;
                           tipo_alta: 0 - normal, 1 - definitiva, ou 2 - óbito;
                           Retira a chave estrangeira de leito do paciente;
                           Coloca a data de alta na sessão atual;
                           Assume os estágios: INTERNADO ou AGENDADO.""",
            request=None
    )
    @action(detail=True, methods=['PATCH'], url_path='dar_alta/(?P<tipo_alta>[^/.]+)')
    def dar_alta(self, request, pk=None, tipo_alta=None):
        try:
            paciente = self.get_object()
            if paciente.estagio_atual == 'INTERNADO':
                if tipo_alta == '0': # alta normal
                    paciente.dar_alta()
                    paciente.atualizar_estagio(usuario=request.user, estagio='ALTA_NORMAL', mensagem="Paciente com alta.")
                elif tipo_alta == '1': # alta definitiva
                    paciente.dar_alta()
                    paciente.atualizar_estagio(usuario=request.user, estagio='ALTA_DEFINITIVA', mensagem="Paciente com alta definitiva.")
                elif tipo_alta == '2': # alta óbito
                    paciente.dar_alta()
                    paciente.atualizar_estagio(usuario=request.user, estagio='ALTA_OBITO', mensagem="Registrado o óbito do paciente nesta data.")
                else:
                    return Response({'erro': 'tipo de alta não definido'}, status=status.HTTP_400_BAD_REQUEST)
            elif paciente.estagio_atual == 'AGENDADO':
                if tipo_alta in ['0', '1']:
                    return Response({'Erro': 'somente é possível registrar óbito para pacientes agendados'})
                elif tipo_alta == '2':
                    paciente.dar_alta()
                    paciente.atualizar_estagio(usuario=request.user, estagio='ALTA_OBITO', mensagem="Registrado o óbito do paciente nesta data.")
                else:
                    return Response({'erro': 'tipo de alta não definido'}, status=status.HTTP_400_BAD_REQUEST)
                return Response({'OK': 'Alta registrada com sucesso!'}, status=status.HTTP_200_OK)
            else:
                return Response({'erro': 'estagio_atual inválido'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'Erro': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @extend_schema(
        summary="Devolução da prescrição (Farmácia)",
        description="""Farmácia devolve para o médico corrigir e reenviar;
                       Altera o estágio do paciente para DEVOLVIDA_PELA_FARMACIA;
                       Cria o registro.""",
        request={
        'application/json': {
            'type': 'object',
            'properties': {
                'mensagem': {
                    'type': 'string'
                }
            },
            'required': ['mensagem']
        }
    }
    )
    @action(detail=True, methods=['PATCH'])
    def devolver_farmacia(self, request, pk=None):
        try:
            paciente = self.get_object()
            serializer = self.get_serializer(paciente)
            if serializer.data['estagio_atual'] == 'ENCAMINHADO_PARA_FARMACIA':
                serializer.atualizar_estagio(obj=paciente, usuario=request.user, estagio='DEVOLVIDO_PELA_FARMACIA', mensagem=request.data['mensagem'])
                return Response({'OK': 'devolvido com sucesso'}, status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({'erro': 'estagio_atual invalido'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'Erro': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @extend_schema(
        summary="Devolução da prescrição (Regulação)",
        description="""A Regulação devolve a prescrição para o médico, solicitando autorização de transferência.
                       Altera o estágio do paciente para DEVOLVIDA_PELA_REGULACAO.
                       Cria o registro.""",
        request={
        'application/json': {
            'type': 'object',
            'properties': {
                'mensagem': {
                    'type': 'string'
                }
            },
            'required': ['mensagem']
        }
    },
    )
    @action(detail=True, methods=['PATCH'])
    def devolver_regulacao(self, request, pk=None):
        try:
            paciente = self.get_object()
            serializer = self.get_serializer(paciente)
            estagios_aceitos = ['ENCAMINHADO_PARA_AGENDAMENTO', 'AUTORIZADO_PARA_TRANSFERENCIA']
            if serializer.data['estagio_atual'] in estagios_aceitos:
                serializer.atualizar_estagio(obj=paciente, usuario=request.user, estagio='DEVOLVIDO_PELA_REGULACAO', mensagem=request.data['mensagem'])
                return Response({'OK': 'devolvido com sucesso'}, status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({'erro': 'estagio_atual invalido'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'Erro': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @extend_schema(
        summary="Autorização de transferência",
        description="""O médico recebe a solicitação de transferência da Regulação e faz a autorização;
                       A prescrição retorna para a Regulação;
                       Altera o estágio atual do paciente para AUTORIZADO_PARA_TRANSFERENCIA;
                       Cria o registro""",
        request={
        'application/json': {
            'type': 'object',
            'properties': {
                'mensagem': {
                    'type': 'string'
                }
            },
            'required': ['mensagem']
        }
    }
    )
    @action(detail=True, methods=['PATCH'])
    def autorizar_transferencia(self, request, pk=None):
        try:
            paciente = self.get_object()
            serializer = self.get_serializer(paciente)
            if serializer.data['estagio_atual'] == 'DEVOLVIDO_PELA_REGULACAO':
                serializer.atualizar_estagio(obj=paciente, usuario=request.user, estagio='AUTORIZADO_PARA_TRANSFERENCIA', mensagem=request.data['mensagem'])
                return Response({'OK': 'devolvido com sucesso'}, status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({'erro': 'estagio_atual invalido'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'Erro': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @extend_schema(
        summary="Confirmação de transferência",
        description="""Regulação confirma a transferência, efetivamente removendo o paciente do fluxo de internação;
                       Altera o estágio atual do paciente para TRANSFERIDO;
                       Cria o registro;
                       A partir desse momento, não é possível mais interagir com esse paciente, apenas efetuar consultas.""",
        request={
        'application/json': {
            'type': 'object',
            'properties': {
                'mensagem': {
                    'type': 'string'
                }
            },
            'required': ['mensagem']
        }
    }
    )
    @action(detail=True, methods=['PATCH'])
    def transferir(self, request, pk=None):
        try:
            paciente = self.get_object()
            serializer = self.get_serializer(paciente)
            if serializer.data['estagio_atual'] == 'AUTORIZADO_PARA_TRANSFERENCIA':
                serializer.atualizar_estagio(obj=paciente, usuario=request.user, estagio='TRANSFERIDO', mensagem=request.data['mensagem'])
                return Response({'OK': 'devolvido com sucesso'}, status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({'erro': 'estagio_atual invalido'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'Erro': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



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
    
    @extend_schema(
        summary="Login no sistema",
        description="""Autentica o usuário e salva suas credenciais na sessão;
                       As credenciais serão usadas na maioria das ações do sistema.""",
        request={
        'application/json': {
            'type': 'object',
            'properties': {
                'username': {
                    'type': 'string'
                },
                'password': {
                    'type': 'string'
                }
            },
            'required': ['username', 'password']
        }
        }
    )
    @action(detail=False, methods=['POST'])
    def login(self, request):
        try:
            username = request.data['username']
            password = request.data['password']
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
                return Response(data, status=status.HTTP_200_OK)    
            else:
                raise User.DoesNotExist
        except User.DoesNotExist:
            return Response({'Erro': 'Nome de usuário ou senha incorretos'}, status=status.HTTP_404_NOT_FOUND)            
        except Exception as e:
            return Response({'erro': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @extend_schema(
        summary="Logout do sistema",
        description="""Desassocia as credenciais do usuário logado à sessão atual do backend. 
                       É importante utilizar a rota de logout para certificar-se de que as credenciais foram limpas do sistema;
                       """,
        request=None
    )
    @action(detail=False, methods=['POST'])
    def logout(self, request):
        try:
            logout(request)
            return Response({'OK': 'Logout feito com sucesso'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'Erro': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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

