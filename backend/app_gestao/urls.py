from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'pacientes', views.PacienteViewSet, basename='paciente')
router.register(r'usuarios', views.UserViewSet, basename='usuario')
router.register(r'prescricoes', views.PrescricaoViewSet, basename='prescricao')

urlpatterns = [
    path('accounts/', include("django.contrib.auth.urls")),
    path('login/', views.fazer_login),
    path('minha_conta/<int:id>', views.minha_conta),

    path('encaminhar_farmacia', views.encaminhar_farmacia),
    #path('api/csrf_token', views.csrf_token, name='csrf_token')
    path('alterar_usuario/<int:id>', views.alterar_dados_do_usuario),
    path('', include(router.urls))
]