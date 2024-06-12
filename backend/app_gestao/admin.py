from django.contrib import admin
from app_gestao.models import Paciente, Leito, Sessao, Registro, Plano_terapeutico

class ListaPaciente(admin.ModelAdmin):
    list_display = ("id", "prontuario", "nome", "estagio_atual", "plano_terapeutico")
    list_display_links = ("id", "prontuario", "nome")

class ListaLeito(admin.ModelAdmin):
    list_display = ("id", "numero", "ocupado", "paciente")
    list_display_links = ("id", "numero")

class ListaSessao(admin.ModelAdmin):
    list_display = ('id', 'leito', 'paciente', 'data_internacao', 'data_alta')
    list_display_links = ('id', 'leito')

class ListaRegistro(admin.ModelAdmin):
    list_display = ('id', 'paciente', 'usuario', 'criado_em', 'sessao', 'estagio_atual', 'mensagem')
    list_display_links = ('id', 'paciente', 'usuario')

class ListaPlanoTerapeutico(admin.ModelAdmin):
    list_display = ('id', 'sessoes_prescritas', 'sessoes_restantes', 'dias_intervalo','data_sugerida', 'medicamentos', )

admin.site.register(Paciente, ListaPaciente)
admin.site.register(Leito, ListaLeito)
admin.site.register(Sessao, ListaSessao)
admin.site.register(Registro, ListaRegistro)
admin.site.register(Plano_terapeutico, ListaPlanoTerapeutico)
