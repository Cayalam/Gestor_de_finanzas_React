# 🚀 Despliegue Rápido en Railway - Checklist

## ✅ Pre-Despliegue (Ya completado)

- [x] `requirements.txt` con todas las dependencias incluyendo `psycopg2-binary`
- [x] `Procfile` configurado con gunicorn
- [x] `railway.json` para Backend y Frontend
- [x] `settings.py` configurado para producción (DEBUG, ALLOWED_HOSTS, DATABASE_URL)
- [x] WhiteNoise para archivos estáticos
- [x] CORS configurado correctamente

---

## 📝 Pasos para Desplegar

### 1️⃣ Crear Proyecto en Railway

1. Ve a https://railway.app
2. Haz clic en **"New Project"**
3. Selecciona **"Deploy PostgreSQL"**
4. ✅ Railway crea la base de datos automáticamente

### 2️⃣ Desplegar Backend Django

1. En el mismo proyecto, haz clic en **"+ New"** → **"GitHub Repo"**
2. Selecciona tu repositorio `Gestor_de_finanzas_React`
3. Configura **Root Directory**: `src_1/Backend_Django`
4. Ve a **"Variables"** y agrega:

```bash
SECRET_KEY=genera-una-clave-segura-aqui
DEBUG=False
ALLOWED_HOSTS=.railway.app
CSRF_TRUSTED_ORIGINS=https://tu-backend.railway.app
CORS_ALLOWED_ORIGINS=https://tu-frontend.railway.app
```

5. Conecta PostgreSQL:
   - Variables → "+ New Variable" → "Reference"
   - Selecciona tu base PostgreSQL
   - Elige `DATABASE_URL`

6. Espera el despliegue (verás los logs en tiempo real)

### 3️⃣ Ejecutar Migraciones

Una vez desplegado:
1. Ve al Backend → "Settings" → Última deployment
2. Abre la terminal (ícono de terminal arriba)
3. Ejecuta:
```bash
python manage.py migrate
python manage.py createsuperuser
```

### 4️⃣ Desplegar Frontend React

1. Haz clic en **"+ New"** → **"GitHub Repo"**
2. Selecciona el mismo repositorio
3. Configura **Root Directory**: `src_1/Frontend_React`
4. Ve a **"Variables"** y agrega:

```bash
VITE_API_URL=https://TU-BACKEND-RAILWAY-URL/api
VITE_API_BASE=https://TU-BACKEND-RAILWAY-URL
VITE_DEMO_MODE=false
```

⚠️ **Importante**: Reemplaza `TU-BACKEND-RAILWAY-URL` con la URL real de tu backend (la encuentras en Settings → Domains)

### 5️⃣ Actualizar CORS en Backend

Después de que el frontend se despliegue:
1. Copia la URL del frontend
2. Ve al Backend → "Variables"
3. Actualiza `CORS_ALLOWED_ORIGINS`:
```bash
CORS_ALLOWED_ORIGINS=https://tu-frontend-url.railway.app
```

4. Actualiza `CSRF_TRUSTED_ORIGINS`:
```bash
CSRF_TRUSTED_ORIGINS=https://tu-backend.railway.app
```

---

## 🧪 Verificar Despliegue

### Backend
- URL: `https://tu-backend.railway.app/api/health/`
- Respuesta esperada: `{"status": "ok"}`

### Frontend
- URL: `https://tu-frontend.railway.app`
- Prueba login/registro
- Verifica que se conecte al backend

### Base de Datos
- Ve al servicio PostgreSQL
- Haz clic en "Data" para ver las tablas
- Deberías ver: `finances_usuario`, `finances_bolsillo`, etc.

---

## 🔧 Variables de Entorno Completas

### Backend (Django)
```bash
SECRET_KEY=<genera-con: python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())">
DEBUG=False
ALLOWED_HOSTS=.railway.app
DATABASE_URL=${{Postgres.DATABASE_URL}}
CSRF_TRUSTED_ORIGINS=https://tu-backend.railway.app
CORS_ALLOWED_ORIGINS=https://tu-frontend.railway.app
```

### Frontend (React)
```bash
VITE_API_URL=https://tu-backend.railway.app/api
VITE_API_BASE=https://tu-backend.railway.app
VITE_DEMO_MODE=false
```

---

## 🐛 Solución de Problemas Comunes

### ❌ Error 400 Bad Request
**Causa**: ALLOWED_HOSTS o CSRF mal configurado
**Solución**: Verifica que las URLs en las variables incluyan `https://`

### ❌ CORS blocked
**Causa**: Frontend no está en CORS_ALLOWED_ORIGINS
**Solución**: Agrega la URL del frontend en las variables del backend

### ❌ Database connection error
**Causa**: DATABASE_URL no está configurada
**Solución**: Conecta PostgreSQL usando "Reference" en Variables

### ❌ Static files not loading
**Causa**: collectstatic no se ejecutó
**Solución**: Railway lo hace automáticamente. Verifica los logs del build

### ❌ Frontend no se conecta
**Causa**: VITE_API_URL apunta a localhost
**Solución**: Actualiza la variable con la URL real de Railway

---

## 💡 Tips Importantes

1. **Dominios Personalizados**: Puedes agregar tu propio dominio en Settings → Domains
2. **Logs**: Revisa los logs en tiempo real desde Deployments → View Logs
3. **Redeploy**: Cada push a GitHub redespliega automáticamente
4. **Backups**: Railway no hace backups automáticos en plan gratuito
5. **Costos**: $5/mes gratis, suficiente para desarrollo/testing

---

## 📞 Recursos

- [Documentación Railway](https://docs.railway.app)
- [Django en Railway](https://docs.railway.app/guides/django)
- Para más detalles, consulta `RAILWAY_DEPLOYMENT.md`

---

**¡Listo! Tu aplicación debería estar funcionando en Railway 🎉**

URLs finales:
- 🔧 Backend: `https://gestor-finanzas-backend.railway.app`
- 🎨 Frontend: `https://gestor-finanzas-frontend.railway.app`
- 🗄️ PostgreSQL: Interna (Railway la gestiona)
