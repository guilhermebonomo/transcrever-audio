FROM python:3.10-slim

# Evita que o Python gere arquivos .pyc e que o output no terminal seja atrasado
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Instala dependências nativas (FFmpeg é estritamente obrigatório para o Whisper)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    ca-certificates \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copia e instala pacotes python (evita expirar muito cache no caso de mexer só nos arquivos da aplicação)
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copia todo o código fonte
COPY . .

# Expõe porta interna do contêiner
EXPOSE 8000

# Executa o app ouvindo em todas as interfaces de rede do conteiner
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
