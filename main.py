from fastapi import FastAPI, Request
from pydantic import BaseModel
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()  # Carrega o .env

app = FastAPI()

# Front-end
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# Groq com chave do .env
client = Groq(api_key=os.getenv("GROQ_KEY"))

class Pergunta(BaseModel):
    pergunta: str

@app.post("/chat")
def chat(pergunta: Pergunta):
    try:
        resposta = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": pergunta.pergunta}]
        )

        return {"resposta": resposta.choices[0].message.content}


    except Exception as e:
        return {"resposta": "Erro ao gerar resposta.", "detalhe": str(e)}
