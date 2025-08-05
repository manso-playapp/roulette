#!/bin/bash

# 🛡️ Script de Backup Automático para Proteger Trabajo
# Ejecuta cada 15 minutos para proteger cambios

set -e

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Función de logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] ⚠️  $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ❌ $1${NC}"
}

# Verificar si estamos en un repo git
if [ ! -d ".git" ]; then
    error "No se encontró repositorio Git en el directorio actual"
    exit 1
fi

# Verificar si hay cambios
if [ -z "$(git status --porcelain)" ]; then
    log "✅ No hay cambios pendientes. Repositorio limpio."
    exit 0
fi

# Obtener timestamp
TIMESTAMP=$(date +'%Y-%m-%d_%H-%M-%S')

# Hacer commit automático
log "📝 Detectados cambios. Creando backup automático..."

# Añadir todos los archivos
git add -A

# Crear commit con timestamp
COMMIT_MSG="🤖 BACKUP AUTOMÁTICO - ${TIMESTAMP}

Cambios detectados y guardados automáticamente.
Sistema de protección contra pérdida de datos.

$(git status --porcelain | head -10)"

git commit -m "$COMMIT_MSG"

# Intentar push (silencioso si falla)
if git push origin main 2>/dev/null; then
    log "☁️  Backup subido a GitHub exitosamente"
else
    warn "⚠️  No se pudo subir a GitHub (posible problema de red)"
    warn "💾 Cambios guardados localmente en Git"
fi

log "✅ Backup completado: commit $(git rev-parse --short HEAD)"
