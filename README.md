# Transcritor IA Local 🎙️

Um web-app minimalista, rápido e elegante para transcrever arquivos de áudio e vídeo de forma 100% local, privada e offline. Desenvolvido em **Python (FastAPI)** no backend e **HTML/CSS/JS (Vanilla)** no frontend.

## 🌟 Recursos
- **100% Local e Seguro**: Seus arquivos nunca saem da sua máquina. Nenhuma API externa ou serviço em nuvem.
- **Extração Inteligente de Áudio**: Suporta diversos arquivos de mídia (MP4, MKV, MP3, WAV, M4A). Envie um vídeo diretamente e o app irá separar apenas a trilha de áudio com o FFmpeg instantaneamente para evitar consumo de RAM.
- **Alta Performance na CPU**: Utiliza a biblioteca `faster-whisper` com quantização INT8. Transcreve com muita rapidez mesmo em processadores (sem placa de vídeo).
- **Timestamps**: Organiza cronologicamente o que foi falado (ex: `[12:00 -> 12:05] Olá mundo`).
- **Pronto para Exportar**: Funcionalidade 1-click para Copiar Texto ou realizar o Download do documento `.txt` completo.
- **Interface Premium**: Construído com forte apelo visual, aplicando efeitos Glassmorphism.

---

## 💻 Requisitos do Sistema
- Navegador de Internet Atualizado.
- **Python 3.8+**
- **FFmpeg**: O motor interno de edição audiovisual.
  - Mão na massa Linux (Ubuntu/Debian): `sudo apt update && sudo apt install ffmpeg`
  - Mão na massa Mac (Homebrew): `brew install ffmpeg`

---

## 🐳 Como Rodar Usando Docker (Recomendado)

A forma mais robusta e "à prova de erros" de publicar e rodar este projeto é utilizando o **Docker**. O contêiner empacota o FFmpeg e o Python garantindo que funcione perfeitamente seja no seu computador pessoal ou em um servidor cloud.

1. Assegure-se de que você possui o [Docker e Docker Compose](https://docs.docker.com/engine/install/) instalados no seu sistema.
2. Na pasta do projeto, suba a aplicação com um único comando:
   ```bash
   docker compose up -d
   # ou 'docker-compose up -d' caso esteja utilizando uma versão (v1) mais antiga do Docker 
   ```
   *Caso você mude o código, pode rodar o executável de atualização que deixamos pronto: `./update.sh`*

3. Entre no seu navegador e acesse a URL:
   👉 **[http://localhost:8012](http://localhost:8012)**

*Nota: ao usar o Docker, a porta padrão externa do projeto fica sendo a **8012**, para evitar conflitos na máquina alvo.*

Para **parar o sistema** com o Docker, rode: `docker compose down` (ou `docker-compose down`).

---

## 🪟 Rodando no Windows

Você pode rodar este projeto no Windows de duas maneiras:

### 1. Via Docker (Recomendado)
1. Instale o [Docker Desktop](https://www.docker.com/products/docker-desktop/).
2. Abra o terminal (PowerShell ou CMD) na pasta do projeto.
3. Execute:
   ```powershell
   docker compose up -d
   ```
4. Acesse: **[http://localhost:8012](http://localhost:8012)**

### 2. Manualmente (Local)
1. Instale o **Python 3.10+** (marcando a opção "Add Python to PATH" no instalador).
2. **FFmpeg no Windows**: 
   - Recomendado baixar via **Chocolatey**: `choco install ffmpeg`
   - Ou baixando o executável no site oficial [ffmpeg.org](https://ffmpeg.org/download.html), extraindo e adicionando a pasta `bin` às Variáveis de Ambiente do Sistema (PATH).
3. Crie e ative o ambiente virtual:
   ```powershell
   python -m venv venv
   .\venv\Scripts\activate
   ```
4. Instale as dependências:
   ```powershell
   pip install -r requirements.txt
   ```
5. Inicie o servidor:
   ```powershell
   python main.py
   ```
   *(Nota: No Windows, use `python main.py` se o script .sh não funcionar no seu terminal)*

---

## 🛠️ Como Instalar e Rodar Manualmente no Linux/Mac (Para Desenvolvedores)

Se você quiser treinar desenvolvimento puro ou rodar manualmente fora do Docker, crie um ambiente enclausurado de Python (`venv`):

1. **Requisito do SO:** Instale o `ffmpeg` (`sudo apt install ffmpeg` ou `brew install ffmpeg`).
2. Crie a pasta `venv` e ative-a:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Instale o manual de bibliotecas que preparamos:
   ```bash
   pip install -r requirements.txt
   ```
4. Execute o script organizador e acesse **[http://127.0.0.1:8000](http://127.0.0.1:8000)**:
   ```bash
   ./start_server.sh
   ```

*Importante: A primeira transcrição que você executar passará alguns minutos "congelada", pois é o instante onde o Hugging Face baixará o modelo Whisper (centenas de megabytes) no seu cache.*

## 🔧 Personalização Técnica
Para alterar o tamanho e assertividade da Inteligência Artificial do bot, acesse o arquivo `main.py` e procure a linha contendo `WhisperModel`. 
Você pode substituir a string por modelos oficiais originais:
- `"tiny"` ou `"base"`: Transcrição incrivelmente rápida para máquinas modestas, mas pode errar pontuações menores.
- `"small"`: O Padrão Ouro. Equilíbrio espetacular de RAM consumida vs. Qualidade do Texto.
- `"medium"` ou `"large-v2"`: Extremamente refinados e assertivos para idiomas mesclados. Porém necessitam de bastante Memória RAM livre na sua máquina e poder de processamento.


Gostou do projeto? Considere me pagar um café:
☕ contato@guilhermebonomo.com