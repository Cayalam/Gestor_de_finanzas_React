# 🚀 Guía de Despliegue en Railway

Esta guía te ayudará a desplegar tu aplicación de Gestor de Finanzas en Railway con PostgreSQL.

## 📋 Prerrequisitos

1. **Cuenta en Railway**: Regístrate en [railway.app](https://railway.app)
2. **Cuenta en GitHub**: Tu código debe estar en un repositorio de GitHub
3. **Railway CLI** (opcional): `npm install -g @railway/cli`

---

## 🗄️ Paso 1: Configurar la Base de Datos PostgreSQL

### Opción A: Desde el Dashboard de Railway

1. Ve a [railway.app](https://railway.app) e inicia sesión
2. Haz clic en **"New Project"**
3. Selecciona **"Deploy PostgreSQL"**
4. Railway creará automáticamente una base de datos PostgreSQL

### Opción B: Agregar PostgreSQL a un proyecto existente

1. Abre tu proyecto en Railway
2. Haz clic en **"+ New"** 
3. Selecciona **"Database"** → **"Add PostgreSQL"**

**✅ Railway generará automáticamente estas variables:**
- `DATABASE_URL` (conexión completa a PostgreSQL)
- `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`

---

## 🔧 Paso 2: Desplegar el Backend Django

### 2.1 Desde GitHub

1. En Railway, haz clic en **"+ New"** → **"GitHub Repo"**
2. Conecta tu cuenta de GitHub si aún no lo has hecho
3. Selecciona el repositorio: **`Gestor_de_finanzas_React`**
4. Configura el **Root Directory**: `src_1/Backend_Django`

### 2.2 Configurar Variables de Entorno

En el servicio del Backend, ve a **"Variables"** y agrega:

```bash
# Django Core
SECRET_KEY=tu-clave-secreta-super-segura-aqui-cambiar
DEBUG=False
ALLOWED_HOSTS=.railway.app
CSRF_TRUSTED_ORIGINS=https://tu-backend.railway.app

# Database (Railway la genera automáticamente al conectar PostgreSQL)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# CORS - Frontend
CORS_ALLOWED_ORIGINS=https://tu-frontend.railway.app,https://tu-dominio-personalizado.com
```

**💡 Importante:**
- Cambia `SECRET_KEY` por una clave segura única (puedes generarla con: `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`)
- Reemplaza `tu-backend.railway.app` con tu URL real de Railway
- Reemplaza `tu-frontend.railway.app` con tu URL real del frontend

### 2.3 Conectar PostgreSQL al Backend

1. En el servicio Backend, ve a **"Settings"** → **"Variables"**
2. Haz clic en **"+ New Variable"** → **"Reference"**
3. Selecciona tu base de datos PostgreSQL
4. Elige la variable `DATABASE_URL`
5. Esto creará automáticamente: `DATABASE_URL=${{Postgres.DATABASE_URL}}`

### 2.4 Configurar el Comando de Build (si es necesario)

Railway debería detectar automáticamente el `Procfile`, pero si necesitas configurarlo manualmente:

**Settings → Deploy:**
- **Build Command**: `pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate`
- **Start Command**: `gunicorn backend.wsgi --bind 0.0.0.0:$PORT`

---

## 🎨 Paso 3: Desplegar el Frontend React

### 3.1 Desde GitHub

1. En Railway, haz clic en **"+ New"** → **"GitHub Repo"**
2. Selecciona el mismo repositorio: **`Gestor_de_finanzas_React`**
3. Configura el **Root Directory**: `src_1/Frontend_React`

### 3.2 Configurar Variables de Entorno

En el servicio del Frontend, ve a **"Variables"** y agrega:

```bash
VITE_API_URL=https://tu-backend.railway.app/api
VITE_API_BASE=https://tu-backend.railway.app
VITE_DEMO_MODE=false
```

**💡 Reemplaza** `tu-backend.railway.app` con la URL real de tu backend en Railway.

### 3.3 Configurar el Build

**Settings → Deploy:**
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run preview` o usa un servidor estático

**Mejor opción - Usar servidor estático:**
1. Instala un servidor estático en tu `package.json`:
```json
"scripts": {
  "preview": "vite preview --host 0.0.0.0 --port $PORT"
}
```

O crea un servidor simple con Express (recomendado para producción).

---

## 🔄 Paso 4: Ejecutar Migraciones Iniciales

Después del primer despliegue del backend:

### Opción A: Desde Railway Dashboard

1. Ve a tu servicio Backend
2. Haz clic en **"Settings"** → **"Deployments"**
3. Selecciona el último deployment exitoso
4. Haz clic en **"View Logs"**
5. Abre la **Terminal** (ícono de terminal en la esquina superior)
6. Ejecuta:
```bash
python manage.py migrate
python manage.py createsuperuser
```

### Opción B: Desde Railway CLI

```bash
railway login
railway link
railway run python manage.py migrate
railway run python manage.py createsuperuser
```

---

## ✅ Paso 5: Verificar el Despliegue

### Backend
1. Visita: `https://tu-backend.railway.app/api/health/`
2. Deberías ver: `{"status": "ok"}`

### Frontend  
1. Visita: `https://tu-frontend.railway.app`
2. Prueba el login/registro
3. Verifica que las transacciones funcionen correctamente

### Base de Datos
1. Ve a tu servicio PostgreSQL en Railway
2. Haz clic en **"Data"** para ver las tablas
3. Verifica que las migraciones se aplicaron correctamente

---

## 🔒 Paso 6: Seguridad y Configuración Final

### 6.1 Configurar Dominio Personalizado (Opcional)

1. En cada servicio, ve a **"Settings"** → **"Domains"**
2. Haz clic en **"+ Generate Domain"** o **"+ Custom Domain"**
3. Actualiza las variables de entorno con el nuevo dominio

### 6.2 Actualizar CORS y CSRF

Después de obtener tus URLs finales, actualiza:

**Backend Variables:**
```bash
ALLOWED_HOSTS=tu-dominio-backend.railway.app,tu-dominio-personalizado.com
CSRF_TRUSTED_ORIGINS=https://tu-dominio-backend.railway.app,https://tu-dominio-personalizado.com
CORS_ALLOWED_ORIGINS=https://tu-frontend.railway.app,https://tu-dominio-frontend.com
```

### 6.3 Configurar Backups de PostgreSQL

Railway no incluye backups automáticos en el plan gratuito:
1. Considera exportar datos periódicamente
2. Usa Railway CLI: `railway pg:dump > backup.sql`

---

## 🐛 Solución de Problemas

### Error: "Bad Request (400)"
- Verifica `ALLOWED_HOSTS` y `CSRF_TRUSTED_ORIGINS`
- Asegúrate de incluir el protocolo `https://` en las URLs

### Error: "CORS policy blocked"
- Verifica `CORS_ALLOWED_ORIGINS` en el backend
- Asegúrate de incluir la URL completa del frontend

### Error de conexión a base de datos
- Verifica que `DATABASE_URL` esté correctamente configurada
- Asegúrate de que el servicio PostgreSQL esté activo
- Verifica los logs del backend

### Migraciones no se aplican
- Ejecuta manualmente desde la terminal de Railway
- Verifica que `psycopg2-binary` esté en `requirements.txt`

### Frontend no se conecta al backend
- Verifica las variables `VITE_API_URL` y `VITE_API_BASE`
- Confirma que el backend esté activo y respondiendo

---

## 📊 Monitoreo

Railway proporciona:
- **Logs en tiempo real**: Ve a cada servicio → "Deployments" → "View Logs"
- **Métricas de uso**: CPU, RAM, Network en la pestaña "Metrics"
- **Reinicio automático**: Railway reinicia servicios que fallan

---

## 💰 Costos

Railway ofrece:
- **Plan Hobby**: $5/mes de crédito gratuito (suficiente para desarrollo)
- **Uso adicional**: ~$0.000231/GB-hora para PostgreSQL
- **Sin tarjeta requerida** para empezar

---

## 📚 Recursos Adicionales

- [Documentación de Railway](https://docs.railway.app)
- [Desplegar Django en Railway](https://docs.railway.app/guides/django)
- [PostgreSQL en Railway](https://docs.railway.app/databases/postgresql)
- [Railway CLI](https://docs.railway.app/develop/cli)

---

## 🎉 ¡Listo!

Tu aplicación de Gestor de Finanzas ahora está desplegada en Railway con PostgreSQL. 

**URLs finales:**
- Backend: `https://tu-backend.railway.app`
- Frontend: `https://tu-frontend.railway.app`
- PostgreSQL: Gestionada internamente por Railway

**Próximos pasos:**
1. Crea un superusuario para el admin de Django
2. Prueba todas las funcionalidades
3. Configura dominios personalizados
4. Implementa backups regulares de la base de datos
