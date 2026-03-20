#!/bin/bash
cd "$(dirname "$0")"
source venv/bin/activate
echo "========================================="
echo "  Transcritor IA Local - Iniciando..."
echo "========================================="
echo "Acesse a interface em: http://127.0.0.1:8000"
echo "Pressione CTRL+C para parar o servidor."
echo ""
uvicorn main:app --host 127.0.0.1 --port 8000
