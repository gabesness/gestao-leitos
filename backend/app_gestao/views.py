from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from app_gestao.models import Paciente, Registro, Plano_terapeutico
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
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
    # VERIFICAR ESTRUTURA DO BANCO DE DADOS 
    p = Paciente.objects.get(id=id_paciente)
    historico = [r for r in Registro.objects.get(paciente=p)]
    pt = Plano_terapeutico.objects.get(paciente=p)
    pass

def dashboard(request):
    pass

def minha_conta(request, id):
    user = User.objects.filter(id=id).values()
    print(user)
    return JsonResponse(list(user), safe=False)

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

def alterar_dados_do_usuario(request, id):
    nome = request.PUT.get('first_name', '')
    sobrenome = request.PUT.get('last_name', '')
    email = request.PUT.get('email', '')
    if nome: u.first_name = nome
    if sobrenome: u.last_name = sobrenome
    if email: u.email = email
    u = User.objects.get(id=id)
