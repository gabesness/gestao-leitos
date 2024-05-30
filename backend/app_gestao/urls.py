from django.urls import path
from . import views

urlpatterns = [
    path("login", views.login),
    path("minha_conta/<int:id>", views.minha_conta)
]