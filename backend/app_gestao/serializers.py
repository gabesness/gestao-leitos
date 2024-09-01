# SERIALIZERS transformam os models em JSON

from rest_framework import serializers
from .models import * 
from django.contrib.auth.models import User

 # A definicao desta classe permite que as demais classes possam ser instanciadas
 # com quantos e quaisquer campos quisermos   
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

class UserSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'first_name', 'last_name', 'email', 'groups']
        extra_kwargs = { 'password': {'write_only': True} }
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        groups = validated_data.pop('groups', [])
        user = User.objects.create_user(**validated_data)
        if password:
            user.set_password(password)
        if groups:
            user.groups.set(groups)
        return user
    
    def update(self, instance, validated_data):
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.set_password(validated_data.get('password', instance.password))
        instance.save()
        return instance

class SessaoSerializer(DynamicFieldsModelSerializer):

    class Meta:
        model = Sessao
        fields = ['id', 'leito', 'paciente', 'data_alta', 'criada_em']

class RegistroSerializer(DynamicFieldsModelSerializer):
    usuario = serializers.SerializerMethodField()
    class Meta:
        model = Registro
        fields = ['id', 'usuario', 'paciente', 'sessao', 'estagio_atual', 'mensagem', 'criado_em']
    
    def get_usuario(self, obj) -> dict:
        usuario = obj.usuario
        return UserSerializer(usuario, fields=['username', 'first_name', 'last_name', 'groups']).data

class PacienteSerializer(DynamicFieldsModelSerializer):
    sessao_atual = serializers.SerializerMethodField()
    historico_atual = serializers.SerializerMethodField()
    historico_completo = serializers.SerializerMethodField()
    plano_terapeutico = serializers.SerializerMethodField()

    class Meta:
        model = Paciente
        fields = ['id', 'nome', 'prontuario', 'estagio_atual', 'leito', 'plano_terapeutico', 'sessao_atual', 'numero_sessao_atual', 'historico_atual', 'historico_completo']
        read_only_fields = ['id', 'estagio_atual', 'leito', 'plano_terapeutico', 'sessao_atual', 'historico_atual', 'historico_completo']

    def update(self, instance, validated_data):
        instance.nome = validated_data.get('nome', instance.nome)
        instance.save()
        return instance
    
    # METODOS INTERNOS PROPRIOS
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
    
    def get_plano_terapeutico(self, obj) -> dict:
        plano_terapeutico = obj.plano_terapeutico
        return Plano_terapeuticoSerializer(plano_terapeutico).data
    
    def atualizar_estagio(self, obj, usuario, estagio, mensagem):
        obj.atualizar_estagio(usuario, estagio, mensagem)

    def criar_prescricao(self, obj):
        obj.criar_prescricao()
    
    def associar_plano(self, obj, plano_terapeutico):
        obj.associar_plano(plano_terapeutico)
    
    def alocar_leito(self, obj, id_leito):
        obj.alocar_leito(id_leito)
    
    def desalocar_leito(self, obj):
        obj.desalocar_leito()

    def internar(self, obj):
        obj.internar()

    def dar_alta(self, obj):
        obj.dar_alta()

class Plano_terapeuticoSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = Plano_terapeutico
        fields = ['id', 'sessoes_prescritas', 'sessoes_restantes', 'dias_intervalo', 'data_sugerida', 'medicamentos']
        read_only_fields = ['sessoes_restantes']
    
    def create(self, validated_data):
        validated_data['sessoes_restantes'] = validated_data['sessoes_prescritas']
        return Plano_terapeutico.objects.create(**validated_data)
    
    def update(self, obj, validated_data):
        obj.sessoes_prescritas = validated_data.get('sessoes_prescritas', obj.sessoes_prescritas)
        obj.dias_intervalo = validated_data.get('dias_intervalo', obj.dias_intervalo)
        obj.data_sugerida = validated_data.get('data_sugerida', obj.data_sugerida)
        obj.medicamentos = validated_data.get('medicamentos', obj.medicamentos)
        obj.save()
        #return obj


class LeitoSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = Leito
        fields = ('__all__')

class PrescricaoSerializer(serializers.Serializer):
    plano_terapeutico = Plano_terapeuticoSerializer()
    mensagem = serializers.CharField()
