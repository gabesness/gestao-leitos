from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from app_gestao.models import Paciente
from django.contrib.auth import authenticate, login
from django.middleware.csrf import get_token

# Create your views here.

def csrf_token(request):
    return JsonResponse({'csrfToken': get_token(request)})

def login(request):
    username = request.POST["username"]
    password = request.POST["password"]
    user = authenticate(request, username=username, password=password)

    if user is not None:
        login(request, user)

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