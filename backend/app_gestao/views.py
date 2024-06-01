from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from app_gestao.models import Paciente
from django.contrib.auth import authenticate, login
#from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt, csrf_protect

# Create your views here.

# def csrf_token(request):
#     return JsonResponse({'csrfToken': get_token(request)})

@csrf_exempt
def fazer_login(request):
    username = request.POST.get("username", '')
    password = request.POST.get("password", '')
    user = authenticate(request, username=username, password=password)

    if user is not None:
        login(request, user)
        return JsonResponse({"mensagem": "logou"})
    else:
        return JsonResponse({"mensagem": "erro"})

def esqueceu_senha(request):
    pass

def alterar_senha(request):
    pass

def home_admin(request):
    pass

def home_medico(request):
    pass

def dashboard(request):
    pass

def pacientes(request):
    pass

def minha_conta(request, id):
    paciente = Paciente.objects.filter(id=id)
    return HttpResponse(paciente)

def lista_pacientes(request):
    pacientes = Paciente.objects.all().values()
    return JsonResponse(list(pacientes), safe=False)

@csrf_exempt
def criar_paciente(request):
    nome = request.POST.get('nome', '')
    prontuario = request.POST.get('prontuario', '')
    #print(nome, prontuario)
    p = Paciente(prontuario=prontuario, nome=nome, estagio_atual="Paciente cadastrado")
    p.save()
    ok = {"mensagem": "paciente criado!!!!!"}
    return JsonResponse(ok)