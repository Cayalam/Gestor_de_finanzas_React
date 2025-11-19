# 🛠️ Comandos Útiles para Railway

## 📦 Instalación de Railway CLI

```bash
# Windows (PowerShell)
npm install -g @railway/cli

# macOS/Linux
curl -fsSL https://railway.app/install.sh | sh

# Verificar instalación
railway --version
```

---

## 🔐 Autenticación

```bash
# Login a Railway
railway login

# Vincular proyecto local a Railway
railway link

# Ver información del proyecto
railway status
```

---

## 🚀 Despliegue y Gestión

```bash
# Ver servicios del proyecto
railway service

# Cambiar al servicio del backend
railway service backend

# Cambiar al servicio del frontend
railway service frontend

# Ver variables de entorno
railway variables

# Agregar variable de entorno
railway variables set SECRET_KEY=tu-clave-segura

# Ver logs en tiempo real
railway logs

# Abrir dashboard en navegador
railway open
```

---

## 🗄️ Gestión de Base de Datos

```bash
# Conectarse a PostgreSQL
railway connect postgres

# Ejecutar comandos Django en Railway
railway run python manage.py migrate
railway run python manage.py createsuperuser
railway run python manage.py collectstatic --noinput

# Crear backup de la base de datos
railway pg:dump > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurar backup
railway pg:restore < backup.sql

# Ver información de PostgreSQL
railway pg:info
```

---

## 🔧 Migraciones y Comandos Django

```bash
# Ejecutar migraciones
railway run python manage.py migrate

# Crear migraciones
railway run python manage.py makemigrations

# Ver estado de migraciones
railway run python manage.py showmigrations

# Crear superusuario
railway run python manage.py createsuperuser

# Abrir shell de Django
railway run python manage.py shell

# Ejecutar cualquier comando
railway run <tu-comando>
```

---

## 📊 Monitoreo y Logs

```bash
# Ver logs del backend
railway logs --service backend

# Ver logs del frontend
railway logs --service frontend

# Ver logs de PostgreSQL
railway logs --service postgres

# Seguir logs en tiempo real
railway logs --follow

# Ver últimas 100 líneas
railway logs --tail 100
```

---

## 🔄 Redeploy y Rollback

```bash
# Forzar redeploy
railway up

# Ver deployments
railway deployments

# Hacer rollback a deployment anterior
railway rollback <deployment-id>

# Ver diferencias entre deployments
railway deployments diff <deployment-id>
```

---

## 🌐 Dominios y URLs

```bash
# Ver dominios configurados
railway domain

# Agregar dominio personalizado
railway domain add tudominio.com

# Ver URL pública del servicio
railway environment
```

---

## 🐛 Debugging

```bash
# Ejecutar comando en el contenedor
railway shell

# Ver variables de entorno en el contenedor
railway run env

# Probar conexión a la base de datos
railway run python -c "import django; django.setup(); from django.db import connection; connection.ensure_connection(); print('✅ DB connected')"

# Ver información del sistema
railway run python -c "import sys; print(sys.version)"

# Verificar instalación de paquetes
railway run pip list
```

---

## 📝 Scripts Útiles

### Generar SECRET_KEY

```bash
# Local
python src_1/Backend_Django/generate_secret_key.py

# En Railway
railway run python generate_secret_key.py
```

### Verificar Configuración Django

```bash
railway run python manage.py check
railway run python manage.py check --deploy
```

### Limpiar Base de Datos (⚠️ Peligroso)

```bash
# Eliminar todas las tablas
railway run python manage.py flush

# Resetear migraciones (no recomendado en producción)
railway run python manage.py migrate --fake <app_name> zero
railway run python manage.py migrate <app_name>
```

---

## 🔍 Información del Proyecto

```bash
# Ver toda la información del proyecto
railway status

# Ver uso de recursos
railway metrics

# Ver precio estimado
railway billing
```

---

## 🎯 Workflows Comunes

### Primer Despliegue Completo

```bash
# 1. Login y vincular
railway login
railway link

# 2. Configurar variables de entorno
railway variables set SECRET_KEY=$(python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())")
railway variables set DEBUG=False
railway variables set ALLOWED_HOSTS=.railway.app

# 3. Conectar a PostgreSQL
railway service backend
railway variables set DATABASE_URL='${{Postgres.DATABASE_URL}}'

# 4. Ejecutar migraciones
railway run python manage.py migrate

# 5. Crear superusuario
railway run python manage.py createsuperuser

# 6. Verificar
railway open
```

### Actualizar Código

```bash
# 1. Hacer cambios locales
git add .
git commit -m "Update: descripción"

# 2. Push a GitHub (Railway detecta y redespliega automáticamente)
git push origin main

# 3. Verificar logs
railway logs --follow
```

### Backup Periódico

```bash
# Crear backup con timestamp
railway pg:dump > backups/backup_$(date +%Y%m%d_%H%M%S).sql

# Comprimir
gzip backups/backup_*.sql
```

### Migración de Datos

```bash
# 1. Exportar datos
railway run python manage.py dumpdata > data.json

# 2. Importar datos
railway run python manage.py loaddata data.json
```

---

## ⚡ Atajos y Tips

```bash
# Alias útiles (agregar a .bashrc o .zshrc)
alias rl='railway login'
alias rls='railway logs --follow'
alias rr='railway run'
alias rs='railway status'
alias ro='railway open'

# Variable de servicio por defecto
export RAILWAY_SERVICE=backend
```

---

## 🆘 Solución de Problemas

```bash
# Ver estado completo
railway status --verbose

# Limpiar caché de Railway CLI
rm -rf ~/.railway

# Reinstalar Railway CLI
npm uninstall -g @railway/cli
npm install -g @railway/cli

# Ver logs de error detallados
railway logs --service backend --level error

# Probar conexión local
curl https://tu-backend.railway.app/api/health/
```

---

## 📚 Recursos

- [Railway CLI Docs](https://docs.railway.app/develop/cli)
- [Railway Guide](https://docs.railway.app/guides)
- [Railway Community](https://discord.gg/railway)

---

**💡 Tip**: Guarda este archivo como referencia rápida. La mayoría de operaciones se pueden hacer desde el CLI sin necesidad del dashboard web.
