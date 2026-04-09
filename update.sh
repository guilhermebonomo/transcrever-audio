#!/bin/bash
# Script de sincronização para atualização direta via GitHub > Docker

echo "========================================="
echo " Puxando atualizações do Repositório..."
echo "========================================="
git pull origin main

echo ""
echo "========================================="
echo " Atualizando Contêineres Docker..."
echo "========================================="
# Apenas a infra alterada fará rebuild, e reinicia em modo dettach
docker compose up --build -d

echo ""
echo "========================================="
echo " Concluído!"
echo " Acesse: http://localhost:8012"
echo "========================================="
