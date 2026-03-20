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

## 🛠️ Como Instalar (Primeira Vez)

Se você acabou de clonar ou fazer download deste projeto, será necessário construir o "Cérebro" do ambiente para o Python (`venv`) e alimentar a receita de dependências:

1. Abra seu Terminal e entre na pasta raiz deste projeto:
   ```bash
   cd transcrever-audio
   ```
2. Crie uma pasta vazia para enclausurar suas instalações (Ambiente Virtual):
   ```bash
   python3 -m venv venv
   ```
3. Ative o ambiente fechado e mande instalar o manual de bibliotecas que preparamos:
   ```bash
   source venv/bin/activate
   pip install -r requirements.txt
   ```

*Nota Extra: A primeira transcrição que você executar passará alguns bons minutos travada, pois é o instante onde o Hugging Face baixará o "peso matemático" neural do modelo Whisper (centenas de megabytes) no seu cache local para uso vitalício!*

---

## 🚀 Como Rodar o Sistema

Sempre que for necessário utilizar a aplicação, o processo é o de apenas um comando:

1. Em seu terminal Linux/Mac, apenas execute o script organizador:
   ```bash
   ./start_server.sh
   ```
   *(Caso dê "permissão negada" pela primeira vez, rode `chmod +x start_server.sh`)*

2. Entre no seu navegador (Google Chrome, Firefox, Safari) e acesse a URL:
   [http://127.0.0.1:8000](http://127.0.0.1:8000)

## 🔧 Personalização Técnica
Para alterar o tamanho e assertividade da Inteligência Artificial do bot, acesse o arquivo `main.py` e procure a linha contendo `WhisperModel`. 
Você pode substituir a string por modelos oficiais originais:
- `"tiny"` ou `"base"`: Transcrição incrivelmente rápida para máquinas modestas, mas pode errar pontuações menores.
- `"small"`: O Padrão Ouro. Equilíbrio espetacular de RAM consumida vs. Qualidade do Texto.
- `"medium"` ou `"large-v2"`: Extremamente refinados e assertivos para idiomas mesclados. Porém necessitam de bastante Memória RAM livre na sua máquina e poder de processamento.
