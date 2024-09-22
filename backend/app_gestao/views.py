from app_gestao.models import Paciente, Registro, Sessao, Plano_terapeutico, Estatisticas
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.contrib.sites.shortcuts import get_current_site
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from rest_framework.viewsets import GenericViewSet
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema
from .serializers import *
from .helpers import *

from datetime import datetime
from string import ascii_letters, digits
from random import SystemRandom

# HELPERS
def helper_gerar_senha(size=8, chars=ascii_letters + digits):
    return ''.join(SystemRandom().choice(chars) for _ in range(size))

# Create your views here.
class PacienteViewSet(GenericViewSet):
    queryset = Paciente.objects.all().order_by('-atualizado_em')
    serializer_class = PacienteSerializer

    @extend_schema(
            summary="Todos os pacientes",
            description="Lista de todos os pacientes, incluindo os falecidos, transferidos e com alta definitiva"
        )
    @action(detail=False, methods=['GET'], url_path='lista')
    def todos(self, request):
        queryset = self.get_queryset().order_by('nome')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @extend_schema(
            summary="Lista de pacientes do quadro Kanban",
            description="""
                        Para as colunas:
                        ALTA_DEFINITIVA,
                        ALTA_OBITO e
                        TRANSFERIDO
                        Somente devem aparecer pacientes dos últimos 7 dias
                        """
    )
    @action(detail=False, methods=['GET'])
    def lista_kanban(self, request):
        try:
            estagios_temporarios = ['ALTA_DEFINITIVA', 'ALTA_OBITO', 'TRANSFERIDO']
            intervalo = timezone.now() - timedelta(days=10)

            pacientes_temporarios = self.get_queryset().filter(estagio_atual__in=estagios_temporarios, atualizado_em__gte=intervalo)
            pacientes_fixos = self.get_queryset().exclude(estagio_atual__in=estagios_temporarios)

            pacientes = pacientes_fixos | pacientes_temporarios
            serializer = self.get_serializer(pacientes, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'Erro': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
            'DEVOLVIDO_PELA_REGULACAO_PARA_MEDICO',
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
            paciente = Paciente.objects.get(prontuario=request.data['prontuario'])
            return Response({'Erro': 'Já existe paciente cadastrado com este prontuário!'}, status=status.HTTP_400_BAD_REQUEST)
        except Paciente.DoesNotExist:
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
                return Response({'OK': 'Paciente cadastrado com sucesso!'}, status=status.HTTP_201_CREATED)
            else:
                return Response({'Erro': 'Dados inválidos, tente novamente.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)})
        
    @extend_schema(
        summary="Alteração de paciente",
        description="Permite editar o nome do paciente",
        request={
        'application/json': {
            'type': 'object',
            'properties': {
                'nome': {
                    'type': 'string'
                }
            },
            'required': ['nome']
        }
    }
    )
    @action(detail=True, methods=['PATCH'])
    def editar_paciente(self, request, pk=None):
        paciente = self.get_object()
        serializer = self.get_serializer(paciente, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'OK': 'Nome do paciente alterado com sucesso.'}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @extend_schema(
            summary="Deletar paciente",
            description="""
                        Permite ao Administrador deletar pacientes.
                        *** ATENÇÃO *** Deletar um paciente é uma ação PERMANENTE!
                        Solicitar a confirmação de exclusão e deixar isso CLARO para o usuário.
                        """
    )
    @action(detail=True, methods=['DELETE'])
    def deletar_paciente(self, request, pk=None):
        try:
            paciente = self.get_object()
            paciente.delete()

            return Response({'OK': 'Paciente deletado com sucesso'}, status=status.HTTP_200_OK)
        
        except Paciente.DoesNotExist:
            return Response({'Erro': 'Paciente não encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'Erro': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
        try:
            fds = ['sessao_atual', 'data_prox_sessao', 'historico_atual', 'plano_terapeutico', 'leito']
            paciente = self.get_object()
            serializer = self.get_serializer(paciente, fields=fds)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'Erro': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PrescricaoViewSet(GenericViewSet):
    queryset = Paciente.objects.all()
    serializer_class = PacienteSerializer

    # ATENCAO: Devido a problemas de CORS entre os dominios do back e front,
    # TODAS as request devem ser passadas com o parametro 'id_usuario'.
    # NAO UTILIZAR request.user, pois o Django nao esta conseguindo atribuir o usuario aa sessao atual

    @extend_schema(
        summary="Criar prescrição do paciente",
        description="""Requer o prontuário do paciente como parâmetro na URL;
                       Assume os estágios CADASTRADO e ALTA_NORMAL;
                       Altera o estado do paciente para PRESCRICAO_CRIADA;
                       cria uma sessao nova para ele;
                       cria um Registro""",
        request={
        'application/json': {
            'type': 'object',
            'properties': {
                'id_usuario': {
                    'type': 'string'
                }
            },
            'required': ['id_usuario']
            }
        }
    )
    @action(detail=False, methods=['PATCH'], url_path='(?P<prontuario>[^/.]+)/criar_prescricao')
    def criar_prescricao(self, request, prontuario):
        try:
            paciente = self.get_queryset().get(prontuario=prontuario)
            serializer = self.get_serializer(paciente)
            estagios_aceitos = ['CADASTRADO', 'ALTA_NORMAL']
            user = User.objects.get(id=request.data['id_usuario'])
            if user:
                if serializer.data['estagio_atual'] in estagios_aceitos:
                    serializer.criar_prescricao(obj=paciente)
                    serializer.atualizar_estagio(obj=paciente, usuario=user, estagio='PRESCRICAO_CRIADA', mensagem='Prescrição criada!')
                    return Response({'OK': 'Prescrição criada com sucesso!'}, status=status.HTTP_200_OK)
                else:
                    return Response({'Erro': 'Já existe prescrição para este paciente!'},status=status.HTTP_400_BAD_REQUEST)
            else: raise User.DoesNotExist
        except Paciente.DoesNotExist: return Response({'Erro': 'Paciente não encontrado'}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist: return Response({'Erro': 'Usuário não encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e: return Response({'Erro': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)  
    
    @extend_schema(
        summary="Enviar prescrição do médico para a Farmácia",
        description="""O médico encaminha a prescrição para a farmácia (devolvida ou não);
                       Assume os estágios PRESCRICAO_CRIADA ou DEVOLVIDO_PELA_FARMACIA;
                       Altera o estágio atual do paciente para ENCAMINHADO_PARA_FARMACIA;
                       A data de internação deve ser, no mínimo, igual ao dia seguinte;
                       Caso o paciente não possua plano terapêutico, é criado um plano novo e atribuído ao paciente;
                       Caso já possua, o plano é apenas alterado;
                       Cria um Registro.""",
        request={
            'application/json': {
                'type': 'object',
                'properties': {
                    'id_usuario': { 'type': 'string' },
                    'plano_terapeutico': {
                        'type': 'object',
                        'properties': {
                            'sessoes_prescritas': { 'type': 'integer' },
                            'dias_intervalo': { 'type': 'integer' },
                            'data_sugerida': { 'type': 'string' },
                            'medicamentos': { 'type': 'string' },
                        }
                    },
                    'mensagem': {'type': 'string'},
                },
                'required': ['id_usuario', 'plano_terapeutico']
            }
        }
        )
    @action(detail=True, methods=['PATCH'])
    def encaminhar_farmacia(self, request, pk=None):
        try:
            plano_json = request.data['plano_terapeutico']
            paciente = self.get_object()
            paciente_serializer = self.get_serializer(paciente)
            user = User.objects.get(id=request.data['id_usuario'])
            estagios_aceitos = ['PRESCRICAO_CRIADA', 'DEVOLVIDO_PELA_FARMACIA', 'DEVOLVIDO_PELA_REGULACAO_PARA_MEDICO']
            data_sugerida = datetime.strptime(request.data.get('plano_terapeutico')['data_sugerida'],'%Y-%m-%d').date()

            if user:
                if paciente_serializer.data['estagio_atual'] in estagios_aceitos:
                    if data_sugerida > timezone.now().date():
                        # Se não houver nenhum plano terapeutico associado ao paciente, criar um plano novo
                        if paciente.plano_terapeutico is None:
                            # Definindo um novo plano terapeutico
                            plano_serializer = Plano_terapeuticoSerializer(data={**plano_json, 'sessoes_restantes': plano_json['sessoes_prescritas']})

                            if plano_serializer.is_valid(): # checando as informacoes do plano novo
                                plano_terapeutico = plano_serializer.create({**plano_json, 'sessoes_restantes': plano_json['sessoes_prescritas']})
                                plano_terapeutico.save() # salva o novo plano no banco de dados
                                paciente_serializer.associar_plano(obj=paciente, plano_terapeutico=plano_terapeutico)
                            else: return Response({plano_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
                        # Se já houver plano para esse paciente, recuperar o existente e alterar as suas informações
                        else:
                            plano = Plano_terapeutico.objects.get(id=paciente_serializer.data['plano_terapeutico']['id']) # consulta o plano terapeutico do paciente
                            plano_serializer = Plano_terapeuticoSerializer(plano)
                            plano_serializer.update(obj=plano, validated_data=plano_json)
                        paciente_serializer.atualizar_estagio(obj=paciente, usuario=user, estagio='ENCAMINHADO_PARA_FARMACIA', mensagem=request.data['mensagem'])
                        return Response({'OK': 'Plano terapêutico criado e paciente encaminhado à Farmacia'}, status=status.HTTP_200_OK)
                    else: return Response({'Erro': 'Data de internação deve ser no mínimo no dia seguinte'}, status=status.HTTP_400_BAD_REQUEST)
                else: return Response({'Erro': 'Paciente já foi encaminhado à farmácia!'}, status=status.HTTP_400_BAD_REQUEST)
            else: raise User.DoesNotExist
        except User.DoesNotExist: return Response({'Erro': 'Usuário inválido'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e: return Response({'Erro': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @extend_schema(
            summary="Encaminhar para agendamento",
            description="""Envio do paciente da Farmácia para a regulação;
                           Assume que o paciente está no estágio de ENCAMINHADO_PARA_FARMACIA;
                           Cria o Registro.""",
            request={
        'application/json': {
            'type': 'object',
            'properties': {
                'id_usuario': {
                    'type': 'string'
                },
                'mensagem': {
                    'type': 'string'
                }
            },
            'required': ['id_usuario']
        }
    }
    )
    @action(detail=True, methods=['PATCH'])
    def encaminhar_agendamento(self, request, pk=None):
        try:
            paciente = self.get_object()
            serializer = self.get_serializer(paciente)
            user = User.objects.get(id=request.data['id_usuario'])
            if user:
                if serializer.data['estagio_atual'] == 'ENCAMINHADO_PARA_FARMACIA':
                    serializer.atualizar_estagio(
                        obj=paciente, 
                        usuario=user, 
                        estagio='ENCAMINHADO_PARA_AGENDAMENTO',
                        mensagem=request.data['mensagem'])
                    return Response(status=status.HTTP_204_NO_CONTENT)
                else:
                    return Response({'Erro': 'Estágio atual inválido'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                raise User.DoesNotExist
        except User.DoesNotExist: return Response({'Erro': 'Usuário inválido'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({'Erro': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @extend_schema(
            summary="Agendar paciente",
            description="""Recebe como parâmetro o id do leito;
                           Assume o estágio atual do paciente como ENCAMINHADO_PARA_AGENDAMENTO;
                           Assume que o leito está livre (FALTA IMPLEMENTAR!);
                           Marca o leito como ocupado e coloca-o no campo 'leito' do paciente;
                           Cria o registro.""",
            request={
        'application/json': {
            'type': 'object',
            'properties': {
                'id_usuario': {
                    'type': 'string'
                }
            },
            'required': ['id_usuario']
            }
        },
    )
    @action(detail=True, methods=['PATCH'], url_path='agendar_paciente/(?P<id_leito>[^/.]+)')
    def agendar_paciente(self, request, pk=None, id_leito=None):
        try:
            paciente = self.get_object()
            serializer = self.get_serializer(paciente)
            user = User.objects.get(id=request.data['id_usuario'])
            hoje = timezone.now().date()
            data_sugerida = datetime.strptime(serializer.data.get('plano_terapeutico')['data_sugerida'],'%Y-%m-%d').date()
            if id_leito is None:
                raise Leito.DoesNotExist
            else:
                leito = Leito.objects.get(id=id_leito)
                if user:
                    if serializer.data['estagio_atual'] == 'ENCAMINHADO_PARA_AGENDAMENTO':
                        if leito.ocupado: return Response({'Erro': 'Este leito já está ocupado!'}, status=status.HTTP_400_BAD_REQUEST)
                        else:
                            # Verificar se esta agendando com mais de 1 dia de antecedencia
                            if data_sugerida - hoje > timedelta(days=1):
                                return Response({'Erro': 'Não é possível agendar um leito com mais de 24h de antecedência'},
                                                status=status.HTTP_400_BAD_REQUEST)
                            else:
                                serializer.alocar_leito(obj=paciente, id_leito=id_leito)
                                serializer.atualizar_estagio(
                                    obj=paciente,
                                    usuario=user,
                                    estagio='AGENDADO',
                                    mensagem=f"Paciente {paciente.nome} agendado para internação."
                                    )
                                return Response({'OK': 'Agendado com sucesso'}, status=status.HTTP_200_OK)
                    else:
                        return Response({'erro': 'estagio_atual inválido'}, status=status.HTTP_400_BAD_REQUEST)
                else: raise User.DoesNotExist
        except User.DoesNotExist: return Response({'Erro': 'Usuário inválido'}, status=status.HTTP_401_UNAUTHORIZED)
        except Leito.DoesNotExist: return Response({'Erro': 'Nenhum leito selecionado'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'Erro': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @extend_schema(
            summary="Internar paciente",
            description="""Coloca a data de internação na sessão atual do paciente;
                           Assume estágio AGENDADO.
                           """,
            request={
        'application/json': {
            'type': 'object',
            'properties': {
                'id_usuario': {
                    'type': 'string'
                }
            },
            'required': ['id_usuario']
            }
        },
    )
    @action(detail=True, methods=['PATCH'])
    def internar(self, request, pk=None):
        try:
            paciente = self.get_object()
            serializer = self.get_serializer(paciente)
            user = User.objects.get(id=request.data['id_usuario'])
            if user:
                if serializer.data['estagio_atual'] == 'AGENDADO':
                    serializer.internar(obj=paciente)
                    serializer.atualizar_estagio(obj=paciente, usuario=user, estagio='INTERNADO', mensagem="Paciente internado.")
                    return Response({'OK': 'Paciente internado com sucesso!'}, status=status.HTTP_200_OK)
                else:
                    return Response({'Erro': 'estagio_atual invalido'}, status=status.HTTP_400_BAD_REQUEST)
            else: raise User.DoesNotExist
        except User.DoesNotExist: return Response({'Erro': 'Usuário inválido'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e: return Response({'Erro': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    @extend_schema(
            summary="Dar alta",
            description="""Recebe um parâmetro 'tipo_alta' na URL;
                           tipo_alta: 0 - normal, 1 - definitiva, ou 2 - óbito;
                           Retira a chave estrangeira de leito do paciente;
                           Coloca a data de alta na sessão atual;
                           Assume os estágios: INTERNADO ou AGENDADO.""",
            request={
        'application/json': {
            'type': 'object',
            'properties': {
                'id_usuario': {
                    'type': 'string'
                }
            },
            'required': ['id_usuario']
            }
        }
    )
    @action(detail=True, methods=['PATCH'], url_path='dar_alta/(?P<tipo_alta>[^/.]+)')
    def dar_alta(self, request, pk=None, tipo_alta=None):
        try:
            paciente = self.get_object()
            user = User.objects.get(id=request.data['id_usuario'])
            if user:
                if paciente.estagio_atual == 'INTERNADO':
                    if tipo_alta == '0': # alta normal
                        paciente.dar_alta()
                        paciente.atualizar_estagio(usuario=user, estagio='ALTA_NORMAL', mensagem="Paciente com alta.")
                    elif tipo_alta == '1': # alta definitiva
                        paciente.dar_alta()
                        paciente.atualizar_estagio(usuario=user, estagio='ALTA_DEFINITIVA', mensagem="Paciente com alta definitiva.")
                    elif tipo_alta == '2': # alta óbito
                        paciente.dar_alta()
                        paciente.atualizar_estagio(usuario=user, estagio='ALTA_OBITO', mensagem="Registrado o óbito do paciente nesta data.")
                    else:
                        return Response({'Erro': 'tipo de alta não definido'}, status=status.HTTP_400_BAD_REQUEST)
                    return Response({'OK': 'Alta registrada com sucesso!'}, status=status.HTTP_200_OK)
                elif paciente.estagio_atual == 'AGENDADO':
                    if tipo_alta in ['0', '1']:
                        return Response({'Erro': 'somente é possível registrar óbito para pacientes agendados'})
                    elif tipo_alta == '2':
                        paciente.dar_alta()
                        paciente.atualizar_estagio(usuario=user, estagio='ALTA_OBITO', mensagem="Registrado o óbito do paciente nesta data.")
                    else:
                        return Response({'Erro': 'tipo de alta não definido'}, status=status.HTTP_400_BAD_REQUEST)
                    return Response({'OK': 'Alta registrada com sucesso!'}, status=status.HTTP_200_OK)
                else:
                    return Response({'Erro': 'estagio_atual inválido'}, status=status.HTTP_400_BAD_REQUEST)
            else: raise User.DoesNotExist
        except User.DoesNotExist: return Response({'Erro': 'Usuário inválido'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e: return Response({'Erro': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @extend_schema(
        summary="Devolução da prescrição (Farmácia)",
        description="""Farmácia devolve para o médico corrigir e reenviar;
                       Altera o estágio do paciente para DEVOLVIDA_PELA_FARMACIA;
                       Cria o registro.""",
        request={
        'application/json': {
            'type': 'object',
            'properties': {
                'id_usuario': {
                    'type': 'string'
                },
                'mensagem': {
                    'type': 'string'
                }
            },
            'required': ['id_usuario']
        }
    }
    )
    @action(detail=True, methods=['PATCH'])
    def devolver_farmacia(self, request, pk=None):
        try:
            paciente = self.get_object()
            serializer = self.get_serializer(paciente)
            user = User.objects.get(id=request.data['id_usuario'])
            if user:
                if serializer.data['estagio_atual'] == 'ENCAMINHADO_PARA_FARMACIA':
                    serializer.atualizar_estagio(obj=paciente, usuario=user, estagio='DEVOLVIDO_PELA_FARMACIA', mensagem=request.data['mensagem'])
                    return Response({'OK': 'Prescrição devolvida com sucesso'}, status=status.HTTP_204_NO_CONTENT)
                else:
                    return Response({'erro': 'estagio_atual invalido'}, status=status.HTTP_400_BAD_REQUEST)
            else: raise User.DoesNotExist
        except User.DoesNotExist: return Response({'Erro': 'Usuário inválido'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e: return Response({'Erro': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @extend_schema(
        summary="Devolução da prescrição (Regulação)",
        description="""A Regulação devolve a prescrição para o médico, solicitando autorização de transferência.
                       Altera o estágio do paciente para DEVOLVIDA_PELA_REGULACAO.
                       Cria o registro.""",
        request={
        'application/json': {
            'type': 'object',
            'properties': {
                'id_usuario': {
                    'type': 'string'
                },
                'mensagem': {
                    'type': 'string'
                }
            },
            'required': ['id_usuario']
        }
    },
    )
    @action(detail=True, methods=['PATCH'])
    def devolver_regulacao(self, request, pk=None):
        try:
            paciente = self.get_object()
            serializer = self.get_serializer(paciente)
            user = User.objects.get(id=request.data['id_usuario'])
            estagios_aceitos = ['ENCAMINHADO_PARA_AGENDAMENTO', 'AUTORIZADO_PARA_TRANSFERENCIA']
            if user:
                if serializer.data['estagio_atual'] in estagios_aceitos:
                    serializer.atualizar_estagio(obj=paciente, usuario=user, estagio='DEVOLVIDO_PELA_REGULACAO', mensagem=request.data['mensagem'])
                    return Response({'OK': 'Prescrição devolvida com sucesso'}, status=status.HTTP_204_NO_CONTENT)
                else:
                    return Response({'erro': 'estagio_atual invalido'}, status=status.HTTP_400_BAD_REQUEST)
            else: raise User.DoesNotExist
        except User.DoesNotExist: return Response({'Erro': 'Usuário inválido'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e: return Response({'Erro': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @extend_schema(
        summary="Devolver prescrição da regulação para alteração da prescrição",
        description="""
                    Permite à Regulação devolver a prescrição ao médico;
                    O médico poderá alterar os dados novamente:
                        - medicamentos, num. de sessões, dias, etc.
                    * Altera o estagio do paciente para DEVOLVIDO_PELA_REGULACAO_PARA_MEDICO;
                    * Cria o Registro
                    """,
        request={
            'application/json': {
                'type': 'object',
                'properties': {
                    'id_usuario': {
                        'type': 'string'
                    },
                    'mensagem': {
                        'type': 'string'
                    }
                },
                'required': ['id_usuario']
            }
        }
    )
    @action(detail=True, methods=['PATCH'])
    def devolver_regulacao_medico(self, request, pk=None):
        try:
            paciente = self.get_object()
            serializer = self.get_serializer(paciente)
            user = User.objects.get(id=request.data.get('id_usuario'))
            estagios_aceitos = ['ENCAMINHADO_PARA_AGENDAMENTO']
            if user:
                if serializer.data['estagio_atual'] in estagios_aceitos:
                    serializer.atualizar_estagio(obj=paciente, usuario=user, estagio='DEVOLVIDO_PELA_REGULACAO_PARA_MEDICO', mensagem=request.data['mensagem'])
                    return Response({'OK': 'Prescrição devolvida com sucesso'}, status=status.HTTP_200_OK)
                else: return Response({'Erro': 'Estágio atual inválido'}, status=status.HTTP_400_BAD_REQUEST)
            else: raise User.DoesNotExist
        except User.DoesNotExist:
            return Response({'Erro': 'Usuário inválido'}, status=status.HTTP_401_UNAUTHORIZED)
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
                'id_usuario': {
                    'type': 'string'
                },
                'mensagem': {
                    'type': 'string'
                }
            },
            'required': ['id_usuario']
        }
    }
    )
    @action(detail=True, methods=['PATCH'])
    def autorizar_transferencia(self, request, pk=None):
        try:
            paciente = self.get_object()
            serializer = self.get_serializer(paciente)
            user = User.objects.get(id=request.data['id_usuario'])
            if user:
                if serializer.data['estagio_atual'] == 'DEVOLVIDO_PELA_REGULACAO':
                    serializer.atualizar_estagio(obj=paciente, usuario=user, estagio='AUTORIZADO_PARA_TRANSFERENCIA', mensagem=request.data['mensagem'])
                    return Response({'OK': 'Paciente autorizado para transferência'}, status=status.HTTP_204_NO_CONTENT)
                else:
                    return Response({'Erro': 'estagio_atual invalido'}, status=status.HTTP_400_BAD_REQUEST)
            else: raise User.DoesNotExist
        except User.DoesNotExist: return Response({'Erro': 'Usuário inválido'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e: return Response({'Erro': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
                'id_usuario': {
                    'type': 'string'
                },
                'mensagem': {
                    'type': 'string'
                }
            },
            'required': ['id_usuario']
        }
    }
    )
    @action(detail=True, methods=['PATCH'])
    def transferir(self, request, pk=None):
        try:
            paciente = self.get_object()
            serializer = self.get_serializer(paciente)
            user = User.objects.get(id=request.data['id_usuario'])
            if user:
                if serializer.data['estagio_atual'] == 'AUTORIZADO_PARA_TRANSFERENCIA':
                    serializer.atualizar_estagio(obj=paciente, usuario=user, estagio='TRANSFERIDO', mensagem=request.data['mensagem'])
                    return Response({'OK': 'Paciente transferido'}, status=status.HTTP_204_NO_CONTENT)
                else:
                    return Response({'Erro': 'estagio_atual invalido'}, status=status.HTTP_400_BAD_REQUEST)
            else: raise User.DoesNotExist
        except User.DoesNotExist: return Response({'Erro': 'Usuário inválido'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e: return Response({'Erro': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
        queryset = self.get_queryset().order_by('first_name')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @extend_schema(
            summary="Detalhes do usuário",
            description="""
                        Retorna as informações de um usuário específico: nome, sobrenome, email, nome de usuario.
                        """
    )
    @action(detail=True, methods=['GET'])
    def info(self, request, pk=None):
        try:
            fds = ['first_name', 'last_name', 'email', 'username']
            user = self.get_object()
            serializer = self.get_serializer(user, fields=fds)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'Erro': 'Usuário não encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'Erro': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
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
    @csrf_exempt
    def logout(self, request):
        try:
            logout(request)
            return Response({'OK': 'Logout feito com sucesso'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'Erro': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @extend_schema(
            summary="Cadastrar usuário",
            description="""Realiza o cadastro do usuário.\n
                           Admin deve informar nome de usuário, nome, sobrenome, email e cargo.\n
                           A senha será gerada automaticamente e enviada para o email cadastrado.\n
                           Obs.: o cargo (campo 'groups') é um ÚNICO número, seguindo os criterios abaixo:\n
                           1 - Medico;\n
                           2 - Farmacia;\n
                           3 - Administracao;\n
                           4 - Regulacao;\n
                           5 - Recepcao\n
                           NÃO É POSSÍVEL criar dois usuarios de usernames iguais\n
                           NÃO É POSSÍVEL criar dois usuarios com o mesmo email (evita conflito de recuperar senha)
                           """,
            request={
            'application/json': {
                'type': 'object',
                'properties': {
                    'username': {
                        'type': 'string'
                    },
                    'first_name': {
                        'type': 'string'
                    },
                    'last_name': {
                        'type': 'string'
                    },
                    'email': {
                        'type': 'string'
                    },
                    'groups': {
                        'type': 'array',
                        'items': {
                            'type': 'string'
                        }
                    }
                },
                'required': ['username', 'first_name', 'last_name', 'email', 'groups']
            }
            }
    )
    @action(detail=False, methods=['POST'])
    def criar_usuario(self, request):
        try:
            check_username = User.objects.filter(username=request.data['username']).exists()
            check_email = User.objects.filter(email=request.data['email']).exists()
            if check_username:
                return Response({'Erro': 'Este nome de usuário já está sendo utilizado'}, status=status.HTTP_400_BAD_REQUEST)
            elif check_email:
                return Response({'Erro': 'O e-mail informado já está cadastrado para outro usuário'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                password = helper_gerar_senha()
                serializer = self.get_serializer(data={**request.data, 'password': password})
                if serializer.is_valid(raise_exception=True):
                    domain = get_current_site(request).domain
                    send_mail(
                    subject="Cadastro de usuário no sistema Oncoleitos",
                    message=f"""
                            Prezado(a) usuário(a),\n
                            Você foi cadastrado no sistema Oncoleitos. Abaixo estão as suas credenciais:\n
                            Nome de usuário: {request.data['username']}.\n
                            Senha provisória: {password}.\n
                            Acesse {domain} para fazer login.\n
                            Recomendamos alterar a senha quando acessar o sistema. Em caso de dúvidas, entre em contato com a Administração.\n
                            Atenciosamente,\n
                            Oncoleitos - Gestão de Leitos Oncológicos
                            """,
                    from_email=None,
                    recipient_list=[request.data['email']]
                )
                    user = serializer.save()
                    return Response({'OK': 'Usuário cadastrado com sucesso!'}, status=status.HTTP_201_CREATED)
                return Response({'Erro': 'dados inválidos'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'Erro': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @extend_schema(
            summary="Editar usuário",
            description="""
                        Permite alterar nome, sobrenome e email do usuário.
                        O novo e-mail não pode ser um e-mail que já esteja cadastrado em outro usuário.
                        """,
            request={
            'application/json': {
                'type': 'object',
                'properties': {
                    'first_name': {
                        'type': 'string'
                    },
                    'last_name': {
                        'type': 'string'
                    },
                    'email': {
                        'type': 'string'
                    }
                }
            }
        }
    )
    @action(detail=True, methods=['PATCH'])
    def editar_usuario(self, request, pk=None):
        try:
            user = self.get_object()
            new_email = request.data.get('email')
            if new_email and new_email != user.email:
                if User.objects.filter(email=new_email).exists():
                    return Response({'Erro': 'Este email já está cadastrado para outro usuário'}, status=status.HTTP_400_BAD_REQUEST)
            
            serializer = self.get_serializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({'OK': 'Informações alteradas com sucesso!'}, status=status.HTTP_200_OK)
            else:
                return Response({'Erro': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'Erro': 'Usuário não encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'Erro': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @extend_schema(
            summary="Desativar usuário",
            description="""Desativar usuário""",
            request=None
    )
    @action(detail=True, methods=['PATCH'])
    def desativar_usuario(self, request, pk=None):
        try:
            user = self.get_object()
            if user:
                if  user.is_active:
                    user.is_active = False
                    user.save()
                    return Response({'OK': 'Usuário desativado com sucesso'}, status=status.HTTP_200_OK)
                else:
                    return Response({'Erro': 'Este usuário já está inativo'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'Erro': 'Usuário não encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'Erro': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @extend_schema(
            summary="Reativar usuário",
            description="""Reativar usuário""",
            request=None
    )
    @action(detail=True, methods=['PATCH'])
    def reativar_usuario(self, request, pk=None):
        try:
            user = self.get_object()
            if user:
                if not user.is_active:
                    user.is_active = True
                    user.save()
                    return Response({'OK': 'Usuário reativado com sucesso'}, status=status.HTTP_200_OK)
                else:
                    return Response({'Erro': 'Este usuário já está ativo'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'Erro': 'Usuário não encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'Erro': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
   
    @extend_schema(
            summary="Alterar senha",
            description="""
                        Rota utilizada na página Minha Conta para o usuário alterar sua própria senha.
                        Recebe os parâmetros: senha atual, nova senha e confirmar nova senha.
                        """,
            request={
            'application/json': {
                'type': 'object',
                'properties': {
                    'senha_atual': {
                        'type': 'string'
                    },
                    'nova_senha': {
                        'type': 'string'
                    },
                    'nova_senha2': {
                        'type': 'string'
                    }
                },
                'required': ['senha_atual', 'nova_senha', 'nova_senha2']
            }
        }
    )
    @action(detail=True, methods=['PATCH'])
    def alterar_senha(self, request, pk=None):
        try:
            u = self.get_object()
            user = authenticate(username=u.username, password=request.data.get('senha_atual'))
            if user:
                pw = request.data.get('nova_senha')
                pw2 = request.data.get('nova_senha2')
                if pw == pw2:
                    serializer = self.get_serializer(user, data={'password': pw}, partial=True)
                    if serializer.is_valid():
                        serializer.save()
                        send_mail(
                            subject="Alteração de senha",
                            message=f"""
                                    Olá, {user.first_name},\n
                                    Verificamos que houve uma alteração recente na sua senha.\n
                                    Caso você não tenha feito essa alteração, por favor entre em contato com seu Administrador.\n
                                    Atenciosamente,\n
                                    Equipe Oncoleitos.
                                    """,
                            from_email=None,
                            recipient_list=[user.email]
                        )
                        return Response({'OK': 'Senha alterada com sucesso!'}, status=status.HTTP_200_OK)
                    else:
                        return Response({'Erro': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response({'Erro': 'As senhas estão diferentes.'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'Erro': 'Senha incorreta. Por favor, tente novamente.'}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({'Erro': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @extend_schema(
        summary="Gerar nova senha",
        description="""
                    O Administrador usa essa funcionalidade para redefinir a senha do usuário;
                    Um email é enviado para o usuário com a senha gerada.
                    """,
        request=None
    )
    @action(detail=True, methods=['PATCH'])
    def gerar_senha(self, request, pk=None):
        try:
            user = self.get_object()
            password = helper_gerar_senha()
            serializer = self.get_serializer(user, data={'password': password}, partial=True)
            if serializer.is_valid():
                serializer.save()
                send_mail(
                    subject="Redefinição de senha",
                    message=f"""
                            Prezado(a) usuário(a),\n
                            Verificamos uma solicitação de redefinição de sua senha por parte do Administrador do sistema.\n
                            Sua senha provisória é: {password}.\n
                            Recomendamos alterar a senha quando acessar o sistema novamente. Em caso de dúvidas, entre em contato com a Administração.\n
                            Atenciosamente,\n
                            Oncoleitos - Gestão de Leitos Oncológicos
                            """,
                    from_email=None,
                    recipient_list=[user.email]
                )
            return Response({'OK': 'Senha alterada com sucesso'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'Erro': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
    @extend_schema(
        summary="Enviar e-mail para redefinição de senha",
        description="""
                    Caso haja um usuário no sistema com o e-mail informado, o sistema irá enviar um e-mail
                    para redefinir a senha.
                    Por segurança, NÃO informar que não foi encontrado um usuário com o e-mail informado.
                    """,
        request={
            'application/json': {
                'type': 'object',
                'properties': {
                    'email': {
                        'type': 'string'
                    }
                },
                'required': ['email']
            }
        }
    )
    @action(detail=False, methods=['POST'])
    def email_redefinir_senha(self, request):
        try:
            email = request.data.get('email')
            user = User.objects.get(email=email)
            if user:
                serializer = self.get_serializer(user)
                token = default_token_generator.make_token(user)
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                domain = get_current_site(request).domain
                protocol = 'https' if request.is_secure() else 'http'
                reset_link = f"{protocol}://{domain}/redefinir-senha/{token}/{uid}"
                send_mail(
                    subject="Redefinição de senha",
                    message=f"""
                            Olá, {user.first_name},\n
                            Recebemos um pedido de redefinição da sua senha.\n
                            Para concluir o processo, por favor, acesse o link {reset_link}.\n
                            Se não foi você quem realizou este pedido, desconsidere esta mensagem.\n
                            Em caso de dúvidas, entre em contato com seu Administrador.\n
                            Atenciosamente,\n
                            Equipe Oncoleitos.
                            """,
                    from_email=None,
                    recipient_list=[user.email]
                )
                return Response({'OK': 'Se houver um usuário cadastrado com este e-mail, você receberá as instruções para redefinir sua senha.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'Erro': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    @extend_schema(
        summary="Confirmar redefinição de senha",
        description="""
                    Recebe um token de validação e a chave primária do usuário criptografada, no padrão URL/token/id
                    Também recebe a nova senha colocada pelo usuário.
                    """,
        request={
            'application/json': {
                'type': 'object',
                'properties': {
                    'token': {
                        'type': 'string'
                    },
                    'uid': {
                        'type': 'string'
                    },
                    'password': {
                        'type': 'string'
                    },
                    'password2': {
                        'type': 'string'
                    }
                },
                'required': ['token', 'uid', 'password', 'password2']
            }
            }
        
    )
    @action(detail=False, methods=['PATCH'])
    def redefinir_senha(self, request):
        try:
            uid = urlsafe_base64_decode(request.data.get('uid'))
            token = request.data.get('token')
            user = User.objects.get(pk=uid)
            pw = request.data.get('password')
            pw2 = request.data.get('password2')
            if user and default_token_generator.check_token(user, token):
                if pw == pw2:
                    serializer = self.get_serializer(user, data={'password': pw}, partial=True)
                    if serializer.is_valid():
                        serializer.save()
                        send_mail(
                            subject="Alteração de senha",
                            message=f"""
                                    Olá, {user.first_name},\n
                                    Verificamos que houve uma alteração recente na sua senha.\n
                                    Caso você não tenha feito essa alteração, por favor entre em contato com seu Administrador.\n
                                    Atenciosamente,\n
                                    Equipe Oncoleitos.
                                    """,
                            from_email=None,
                            recipient_list=[user.email]
                        )
                        return Response({'OK': 'Senha alterada com sucesso! Por favor, faça login no sistema.'}, status=status.HTTP_200_OK)
                    else:
                        return Response({'Erro': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    return Response({'Erro': 'As senhas informadas estão diferentes.'}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'Erro': 'Não foi possível validar as informações. Por favor, tente novamente.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'Erro': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class EstatisticaViewSet(GenericViewSet):
    """
    Estatisticas -- APENAS requisicoes GET:
    * Taxa de ocupacao de leitos x tempo;

    """

        # ======== ESTRUTURA DAS FUNCOES =========
    # Modo Ultimos x dias:
    # Parametro intervalo:<int> representa quantos dias para tras o sistema vai buscar as informacoes
    # Modo Mes/Ano:
    # Parametros mes:<int> e ano:<int>, busca apenas no periodo informado
    # Modo Completo:
    # Busca todos os registros do sistema
    
    queryset = Registro.objects.all()
    serializer_class = RegistroSerializer

    @extend_schema(
            summary="*** INCOMPLETA *** Estatísticas de todo o período",
            description="""
                        Retorna os dados para a dashboard de todo o período.
                        *** Falta taxa de ocupacao ***
                        """
    )
    @action(detail=False, methods=['GET'])
    def all(self, request):
        try:
            data = {
                "histograma_num_sessoes": Estatisticas.histograma_num_sessoes(),
                "histograma_tempo_internacao": Estatisticas.histograma_tempo_internacao(),
                "pacientes_novos": Estatisticas.pacientes_novos(),
                "taxa_ocupacao": {},
                "historico_altas": Estatisticas.historico_altas()
            }
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'Erro': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @extend_schema(
            summary="*** INCOMPLETA *** Estatísticas do sistema",
            description="""
                        Mostra as estatísticas do sistema.
                        Aceita como parâmetro <int: dias>, o sistema irá considerar apenas os n últimos dias.
                        *** Falta taxa de ocupação ***
                        """
    )
    @action(detail=False, methods=['GET'], url_path='(?P<dias>[^/.]+)')
    def ultimos_dias(self, request, dias=None):
        dias = int(dias)
        try:
            data = {
                "histograma_num_sessoes": Estatisticas.histograma_num_sessoes(dias),
                "histograma_tempo_internacao": Estatisticas.histograma_tempo_internacao(dias),
                "pacientes_novos": Estatisticas.pacientes_novos(dias),
                "taxa_ocupacao": {},
                "historico_altas": Estatisticas.historico_altas(dias)
            }
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'Erro': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

