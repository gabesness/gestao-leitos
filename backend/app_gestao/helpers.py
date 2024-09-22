from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from io import BytesIO
from django.http import HttpResponse

def estagio_to_readable(estagio):
    estagio_mapping = {
        "CADASTRADO": "Paciente cadastrado",
        "PRESCRICAO_CRIADA": "Prescrição criada",
        "DEVOLVIDO_PELA_FARMACIA": "Devolvido pela farmácia",
        "DEVOLVIDO_PELA_REGULACAO": "Transferência solicitada pela regulação",
        "DEVOLVIDO_PELA_REGULACAO_PARA_MEDICO": "Devolvido pela regulação para alterações na prescrição",
        "ENCAMINHADO_PARA_FARMACIA": "Encaminhado para a farmácia",
        "ENCAMINHADO_PARA_AGENDAMENTO": "Encaminhado para agendamento",
        "AUTORIZADO_PARA_TRANSFERENCIA": "Autorizado para transferência",
        "TRANSFERIDO": "Transferido para outro hospital",
        "AGENDADO": "Internação agendada",
        "INTERNADO": "Paciente internado",
        "ALTA_OBITO": "Alta por óbito",
        "ALTA_NORMAL": "Alta normal",
        "ALTA_DEFINITIVA": "Alta definitiva",
    }
    return estagio_mapping.get(estagio, "Desconhecido")
    