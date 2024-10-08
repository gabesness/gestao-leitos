from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'pacientes', views.PacienteViewSet, basename='paciente')
router.register(r'usuarios', views.UserViewSet, basename='usuario')
router.register(r'prescricoes', views.PrescricaoViewSet, basename='prescricao')
router.register(r'leitos', views.LeitoViewSet, basename='leito')
router.register(r'estatisticas', views.EstatisticaViewSet, basename='estatistica')

urlpatterns = [
    path('accounts/', include("django.contrib.auth.urls")),
    #path('api/csrf_token', views.csrf_token, name='csrf_token')
    path('', include(router.urls))
]