"""
URL configuration for gestaoleitos project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from app_gestao import views

urlpatterns = [
    path('accounts/', include("django.contrib.auth.urls")),
    path('login/', views.fazer_login),
    path('minha_conta/<int:id>', views.minha_conta),
    path('lista_pacientes/', views.lista_pacientes),
    path('admin/', admin.site.urls),
    #path('api/csrf_token', views.csrf_token, name='csrf_token')
    path('criar_paciente/', views.criar_paciente)
]
