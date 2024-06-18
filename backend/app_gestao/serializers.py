# SERIALIZERS transformam os models em JSON

from rest_framework import serializers
from .models import * 
from django.contrib.auth.models import User
    
class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    """
    A ModelSerializer that takes an additional `fields` argument that
    controls which fields should be displayed.
    """

    def __init__(self, *args, **kwargs):
        # Don't pass the 'fields' arg up to the superclass
        fields = kwargs.pop('fields', None)

        # Instantiate the superclass normally
        super().__init__(*args, **kwargs)

        if fields is not None:
            # Drop any fields that are not specified in the `fields` argument.
            allowed = set(fields)
            existing = set(self.fields)
            for field_name in existing - allowed:
                self.fields.pop(field_name)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'first_name', 'last_name', 'email', 'groups']

class SessaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sessao
        fields = ['id', 'numero', 'leito', 'data_internacao', 'data_alta', 'criada_em']

class RegistroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Registro
        fields = ['id', 'usuario', 'paciente', 'sessao', 'estagio_atual', 'mensagem', 'criado_em']

class PacienteSerializer(DynamicFieldsModelSerializer):
    sessao_atual = serializers.SerializerMethodField()
    historico_atual = serializers.SerializerMethodField()
    historico_completo = serializers.SerializerMethodField()

    class Meta:
        model = Paciente
        fields = ['id', 'nome', 'prontuario', 'estagio_atual', 'leito', 'plano_terapeutico', 'sessao_atual', 'historico_atual', 'historico_completo']
        read_only_fields = ['id', 'estagio_atual', 'leito', 'plano_terapeutico', 'sessao_atual', 'historico_atual', 'historico_completo']

    def get_sessao_atual(self, obj) -> dict:
        sessao = obj.sessao_atual()
        if sessao:
            return SessaoSerializer(sessao).data
        else:
            return None

    def get_historico_atual(self, obj) -> list:
        historico = obj.historico_atual()
        return RegistroSerializer(historico, many=True).data

    def get_historico_completo(self, obj) -> list:
        historico = obj.historico_completo()
        return RegistroSerializer(historico, many=True).data

