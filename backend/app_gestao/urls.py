from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'pacientes', views.PacienteViewSet, basename='paciente')
router.register(r'usuarios', views.UserViewSet, basename='usuario')

urlpatterns = [
    path('accounts/', include("django.contrib.auth.urls")),
    path('login/', views.fazer_login),
    path('minha_conta/<int:id>', views.minha_conta),

    path('criar_prescricao/', views.criar_prescricao),
    path('encaminhar_farmacia', views.encaminhar_farmacia),
    #path('api/csrf_token', views.csrf_token, name='csrf_token')
    path('criar_paciente/', views.criar_paciente),
    path('alterar_usuario/<int:id>', views.alterar_dados_do_usuario),
    #path('historico_completo/<int:id_paciente>/', views.HistoricoCompleto.as_view(), name='historico-completo'),
    #path('historico_atual/<int:id_paciente>/', views.HistoricoAtual.as_view(), name='historico-atual'),
    path('', include(router.urls))
]