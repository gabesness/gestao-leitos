from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from io import BytesIO
from django.http import HttpResponse

def estagio_to_readable(estagio):
    estagio_mapping = {
        "CADASTRADO": "Paciente cadastrado",
        "PRESCRICAO_CRIADA": "Prescrição criada",
        "DEVOLVIDO_PELA_FARMACIA": "Devolvido pela farmácia",
        "DEVOLVIDO_PELA_REGULACAO": "Devolvido pela regulação",
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
    

def generate_pdf(data):
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter

    # Add title
    c.setFont("Helvetica-Bold", 16)
    c.drawString(100, height - 100, "Patient History")

    # Add table headers
    c.setFont("Helvetica-Bold", 12)
    y = height - 140
    c.drawString(100, y, "ID")
    c.drawString(200, y, "Username")
    c.drawString(300, y, "First Name")
    c.drawString(400, y, "Last Name")
    c.drawString(500, y, "Paciente")
    c.drawString(600, y, "Sessao")
    c.drawString(700, y, "Estagio Atual")
    c.drawString(800, y, "Mensagem")
    c.drawString(900, y, "Criado Em")

    # Add table rows
    c.setFont("Helvetica", 10)
    y -= 20
    for item in data:
        c.drawString(100, y, str(item["id"]))
        c.drawString(200, y, item["usuario"]["username"])
        c.drawString(300, y, item["usuario"]["first_name"])
        c.drawString(400, y, item["usuario"]["last_name"])
        c.drawString(500, y, str(item["paciente"]))
        c.drawString(600, y, str(item["sessao"]))
        c.drawString(700, y, item["estagio_atual"])
        c.drawString(800, y, item["mensagem"])
        c.drawString(900, y, item["criado_em"])
        y -= 20

    c.save()
    buffer.seek(0)
    return buffer.getvalue()  # Return the PDF as raw bytes