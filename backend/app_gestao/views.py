from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from app_gestao.models import Paciente, Registro, Sessao
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
#from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.core import serializers
from django.forms.models import model_to_dict

# Create your views here.

# def csrf_token(request):
#     return JsonResponse({'csrfToken': get_token(request)})

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

def consultar_prescricao_atual_do_paciente(request, id_paciente):
    # PRESCRICAO -> HISTORICO DA SESSAO ATUAL DO PACIENTE + PLANO TERAPEUTICO
    try:
        p = Paciente.objects.get(id=id_paciente)
        plano = Paciente.objects.get(id=id_paciente).plano_terapeutico
        #sessao_atual = Sessao.objects.filter(id=id_paciente).order_by('creation_time').first()
        historico = [r for r in Registro.objects.get(paciente=p)]

        return JsonResponse([p, historico])

    except Exception as e:
        return JsonResponse({'erro': str(e)})
    pass

def dashboard(request):
    pass

def minha_conta(request, id):
    try:
        user = User.objects.filter(id=id).values()
        return JsonResponse(list(user), safe=False)
    except Exception as e:
        return JsonResponse({"erro": str(e)})

def lista_pacientes(request):
    pacientes = Paciente.objects.all().values()
    return JsonResponse(list(pacientes), safe=False)

def lista_pacientes_medico(request):
    try:
        estagios = [
            'CADASTRADO',
            'PRESCRICAO_CRIADA',
            'PRESCRICAO_DEVOLVIDA_PELA_FARMACIA',
            'PRESCRICAO_DEVOLVIDA_PELA_REGULACAO',
            'INTERNADO',
            ]
        pacientes = Paciente.objects.filter(estagio_atual__in=estagios).values()

        return JsonResponse(list(pacientes), safe=False)
    except Exception as e:
        return JsonResponse({'erro': str(e)})
    
def lista_pacientes_farmacia(request):
    try:
        pacientes = Paciente.objects.filter(estagio_atual='ENCAMINHADO_PARA_FARMACIA').values()

        return JsonResponse(list(pacientes), safe=False)
    except Exception as e:
        return JsonResponse({'erro': str(e)})
    
def lista_pacientes_regulacao(request):
    try:
        estagios = [
            'ENCAMINHADO_PARA_AGENDAMENTO',
            'AGENDADO',
            'AUTORIZADO_PARA_TRANSFERENCIA',
            ]
        pacientes = Paciente.objects.filter(estagio_atual__in=estagios).values()

        return JsonResponse(list(pacientes), safe=False)
    except Exception as e:
        return JsonResponse({'erro': str(e)})

@csrf_exempt
def criar_paciente(request):
    nome = request.POST.get('nome', '')
    prontuario = request.POST.get('prontuario', '')
    try:
        if Paciente.objects.get(prontuario=prontuario).exists():
            p = Paciente(prontuario=prontuario, nome=nome, estagio_atual="Paciente cadastrado")
            p.save()
            return JsonResponse({"OK": "paciente criado com sucesso!"})
        else:
            return JsonResponse({"ERRO": "já existe paciente cadastrado com este prontuário"})
    except Exception as e:
        return JsonResponse({"erro": str(e)})

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

