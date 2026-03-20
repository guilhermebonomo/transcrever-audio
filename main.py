import os
import shutil
import subprocess
import uuid
from pathlib import Path
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from faster_whisper import WhisperModel

app = FastAPI(title="Local Transcriber")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Criar e configurar diretório estático
STATIC_DIR = Path("static")
STATIC_DIR.mkdir(exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Carregar o modelo Whisper. "small" é equilibrado (rápido e preciso).
# Compute type int8 deixa muito leve para rodar no processador.
print("Carregando o modelo do Whisper...")
model = WhisperModel("small", device="cpu", compute_type="int8")
print("Modelo carregado com sucesso!")

TEMP_DIR = Path("temp_processing")
TEMP_DIR.mkdir(exist_ok=True)

def extract_and_normalize_audio(input_file: str, output_file: str):
    """Extrai áudio do vídeo e/ou normaliza qualquer áudio para 16kHz WAV mono."""
    command = [
        "ffmpeg",
        "-i", input_file,
        "-vn",          # Sem vídeo
        "-acodec", "pcm_s16le", # Converte para 16-bit WAV (ideal pro whisper)
        "-ar", "16000",   # 16kHz
        "-ac", "1",       # Mono
        "-y",           # Sobrescreve
        output_file
    ]
    try:
        subprocess.run(command, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return True
    except subprocess.CalledProcessError:
        return False

@app.post("/transcribe")
async def transcribe_file(file: UploadFile = File(...)):
    # Gerar ID único para cada arquivo
    job_id = str(uuid.uuid4())
    ext = Path(file.filename).suffix
    temp_input = TEMP_DIR / f"{job_id}{ext}"
    temp_audio = TEMP_DIR / f"{job_id}.wav"
    
    try:
        # Salvar o arquivo que o usuário enviou (pode ter vários GBs)
        with open(temp_input, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Extrair e alinhar o áudio pra ficar perfeito pro Whisper
        success = extract_and_normalize_audio(str(temp_input), str(temp_audio))
        if not success:
            return JSONResponse(status_code=400, content={"error": "Falha ao processar a mídia com FFmpeg. Verifique se o arquivo não está corrompido ou tem áudio."})
            
        # Transcrever
        segments, info = model.transcribe(str(temp_audio), beam_size=5, language=None)
        
        def format_timestamp(seconds: float) -> str:
            hours = int(seconds // 3600)
            minutes = int((seconds % 3600) // 60)
            secs = int(seconds % 60)
            if hours > 0:
                return f"{hours:02d}:{minutes:02d}:{secs:02d}"
            return f"{minutes:02d}:{secs:02d}"

        full_text = []
        for segment in segments:
            start = format_timestamp(segment.start)
            end = format_timestamp(segment.end)
            full_text.append(f"[{start} -> {end}] {segment.text.strip()}")
            
        transcription = "\n".join(full_text).strip()
        
        return {
            "filename": file.filename,
            "language": info.language,
            "transcription": transcription
        }
        
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
        
    finally:
        # Segurança: limpar os gigabytes do disco depois da transcrição :)
        if temp_input.exists():
            temp_input.unlink()
        if temp_audio.exists():
            temp_audio.unlink()

@app.get("/")
def read_root():
    index_path = STATIC_DIR / "index.html"
    if not index_path.exists():
        return HTMLResponse(content="<h1>App Backend rodando! Aguardando o Frontend ser salvo em static/index.html</h1>")
    with open(index_path, "r", encoding="utf-8") as f:
        return HTMLResponse(content=f.read())
