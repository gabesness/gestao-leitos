# SERIALIZERS transformam os models em JSON

from rest_framework import serializers
from .models import * 
from django.contrib.auth.models import User

class PacienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paciente
        fields = ['id', 'nome', 'prontuario', 'estagio_atual', 'plano_terapeutico']
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'first_name', 'last_name', 'email']
