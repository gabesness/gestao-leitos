from django.contrib import admin
from app_gestao.models import Paciente, Leito

class ListaPaciente(admin.ModelAdmin):
    list_display = ("id", "prontuario", "nome", "estagio_atual")
    list_display_links = ("id", "prontuario", "nome")

class ListaLeito(admin.ModelAdmin):
    list_display = ("id", "numero", "ocupado", "paciente")
    list_display_links = ("id", "numero")

admin.site.register(Paciente, ListaPaciente)
admin.site.register(Leito, ListaLeito)
