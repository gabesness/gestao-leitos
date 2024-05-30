from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from app_gestao.models import Paciente
from django.contrib.auth import authenticate, login

# Create your views here.

def home(request):
    html = "<h1>Sistema<h1>"
    return HttpResponse(html)

def login(request):
    username = request.POST["username"]
    password = request.POST["password"]
    user = authenticate(request, username=username, password=password)

    if user is not None:
        login(request, user)
    else:
        html = "<h1>Usuário não encontrado :("
        return HttpResponse(html)

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