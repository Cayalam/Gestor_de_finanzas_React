# ✅ Checklist Pre-Despliegue Railway

Usa este checklist para asegurarte de que todo está listo antes de desplegar en Railway.

---

## 📦 Backend (Django)

### Archivos Requeridos
- [x] `requirements.txt` - Contiene todas las dependencias
  - [x] django
  - [x] djangorestframework
  - [x] django-cors-headers
  - [x] gunicorn
  - [x] whitenoise
  - [x] psycopg2-binary
  - [x] dj-database-url
  - [x] python-dotenv

- [x] `Procfile` - Define el comando de inicio
  ```
  web: gunicorn backend.wsgi --log-file -
  ```

- [x] `railway.json` - Configuración de Railway
- [x] `.python-version` - Especifica versión de Python
- [x] `.env.example` - Template de variables de entorno
- [x] `.gitignore` - Incluye `.env`, `*.pyc`, `db.sqlite3`, etc.

### Configuración settings.py
- [x] `SECRET_KEY` lee de variable de entorno
- [x] `DEBUG` controlado por variable de entorno (False en producción)
- [x] `ALLOWED_HOSTS` lee de variable de entorno
- [x] `DATABASES` usa `dj_database_url` para PostgreSQL
- [x] `STATIC_ROOT` y `STATIC_URL` configurados
- [x] `STATICFILES_STORAGE` usa WhiteNoise
- [x] `MIDDLEWARE` incluye WhiteNoiseMiddleware
- [x] `CORS_ALLOWED_ORIGINS` configurado
- [x] `CSRF_TRUSTED_ORIGINS` configurado
- [x] `REST_FRAMEWORK` con TokenAuthentication

### Verificaciones
- [ ] Ejecutar `python manage.py check --deploy` sin errores
- [ ] Generar `SECRET_KEY` con `python generate_secret_key.py`
- [ ] Probar migraciones localmente: `python manage.py migrate`
- [ ] Verificar que collectstatic funciona: `python manage.py collectstatic --noinput`
- [ ] Probar el servidor local: `gunicorn backend.wsgi`

---

## 🎨 Frontend (React)

### Archivos Requeridos
- [x] `package.json` - Dependencias y scripts
  - [x] Script `build`: `vite build`
  - [x] Script `preview`: `vite preview`

- [x] `railway.json` - Configuración de Railway
- [x] `.env.example` - Template de variables de entorno
- [x] `.gitignore` - Incluye `node_modules/`, `dist/`, `.env`

### Configuración
- [x] Variables VITE_* en `.env` (no subir a Git)
- [x] `api.js` lee correctamente `VITE_API_URL`
- [x] Build de producción genera carpeta `dist/`

### Verificaciones
- [ ] Ejecutar `npm install` sin errores
- [ ] Ejecutar `npm run build` exitosamente
- [ ] Probar build local: `npm run preview`
- [ ] Verificar que no hay errores en consola del navegador
- [ ] Probar CORS localmente con backend

---

## 🗄️ Base de Datos

### Migraciones
- [x] Todas las migraciones creadas: `python manage.py makemigrations`
- [ ] Sin conflictos de migraciones
- [ ] Archivo `0001_initial.py` en cada app
- [ ] Migraciones probadas localmente

### Modelos
- [x] `AUTH_USER_MODEL` configurado en settings.py
- [x] Relaciones ForeignKey correctamente definidas
- [x] `__str__` methods implementados
- [x] Validators agregados donde sea necesario

---

## 🔒 Seguridad

### Variables de Entorno
- [ ] `SECRET_KEY` generada y única (NUNCA usar la de desarrollo)
- [ ] `DEBUG=False` en producción
- [ ] `ALLOWED_HOSTS` incluye `.railway.app`
- [ ] `CSRF_TRUSTED_ORIGINS` incluye URLs con `https://`
- [ ] `CORS_ALLOWED_ORIGINS` incluye frontend con `https://`
- [ ] `.env` en `.gitignore` (verificar que NO está en Git)

### Configuración
- [ ] HTTPS habilitado (Railway lo hace automáticamente)
- [ ] Passwords hasheados (Django lo hace por defecto)
- [ ] Token authentication configurada
- [ ] No hay información sensible en el código fuente

---

## 📝 Git & GitHub

### Repositorio
- [x] Código en GitHub
- [x] `.gitignore` configurado correctamente
- [x] Sin archivos `.env` en el repositorio
- [x] Sin `db.sqlite3` en el repositorio
- [x] Sin `__pycache__/` en el repositorio
- [ ] README.md actualizado con instrucciones
- [ ] Último commit pushed a GitHub

### Branches
- [ ] Branch `main` o `master` está actualizado
- [ ] No hay cambios sin commit
- [ ] No hay conflictos sin resolver

---

## 🚀 Railway Setup

### Cuenta y Proyecto
- [ ] Cuenta creada en https://railway.app
- [ ] GitHub conectado a Railway
- [ ] Nuevo proyecto creado

### PostgreSQL
- [ ] PostgreSQL agregado al proyecto
- [ ] Variables generadas automáticamente
- [ ] Conexión verificada

### Backend Service
- [ ] Repositorio conectado
- [ ] Root directory: `src_1/Backend_Django`
- [ ] Variables de entorno configuradas:
  - [ ] `SECRET_KEY`
  - [ ] `DEBUG=False`
  - [ ] `ALLOWED_HOSTS=.railway.app`
  - [ ] `DATABASE_URL=${{Postgres.DATABASE_URL}}`
  - [ ] `CSRF_TRUSTED_ORIGINS`
  - [ ] `CORS_ALLOWED_ORIGINS`

### Frontend Service
- [ ] Repositorio conectado
- [ ] Root directory: `src_1/Frontend_React`
- [ ] Variables de entorno configuradas:
  - [ ] `VITE_API_URL=https://tu-backend.railway.app/api`
  - [ ] `VITE_API_BASE=https://tu-backend.railway.app`
  - [ ] `VITE_DEMO_MODE=false`

---

## 🧪 Testing Post-Despliegue

### Backend
- [ ] Health check responde: `https://backend.railway.app/api/health/`
- [ ] Admin panel accesible: `https://backend.railway.app/admin/`
- [ ] API endpoints responden correctamente
- [ ] Logs no muestran errores críticos

### Frontend
- [ ] Sitio carga correctamente: `https://frontend.railway.app`
- [ ] No hay errores 404 en recursos
- [ ] CSS y JavaScript cargan
- [ ] No hay errores CORS en consola

### Base de Datos
- [ ] Migraciones aplicadas: `railway run python manage.py migrate`
- [ ] Superusuario creado: `railway run python manage.py createsuperuser`
- [ ] Tablas visibles en Railway Dashboard
- [ ] Datos se guardan correctamente

### Integración
- [ ] Login/Registro funciona
- [ ] Crear transacciones funciona
- [ ] Listar transacciones funciona
- [ ] Dashboard muestra datos correctamente
- [ ] Gráficas se renderizan
- [ ] Navegación entre páginas funciona

---

## 📊 Monitoring

### Railway Dashboard
- [ ] Métricas de CPU normales (<80%)
- [ ] Métricas de RAM normales (<80%)
- [ ] No hay errores en logs
- [ ] Deployments exitosos (color verde)

### Performance
- [ ] Tiempo de respuesta API <500ms
- [ ] Tiempo de carga frontend <3s
- [ ] No hay queries lentas (>1s)

---

## 📚 Documentación

- [x] `RAILWAY_QUICK_START.md` - Guía rápida
- [x] `RAILWAY_DEPLOYMENT.md` - Guía completa
- [x] `RAILWAY_COMMANDS.md` - Comandos útiles
- [x] `RAILWAY_ARCHITECTURE.md` - Arquitectura visual
- [x] `.env.example` archivos actualizados
- [ ] README.md con instrucciones de despliegue

---

## 🎯 Pasos Finales

1. [ ] Guardar URLs de Railway en lugar seguro
2. [ ] Configurar dominios personalizados (opcional)
3. [ ] Configurar backups automáticos
4. [ ] Monitorear uso de recursos en Railway
5. [ ] Probar recuperación de backup
6. [ ] Compartir URLs con el equipo/usuario final

---

## ⚠️ Antes de Marcar como Completo

**Verifica esto una última vez:**

```bash
# Backend health check
curl https://tu-backend.railway.app/api/health/

# Frontend accesible
curl -I https://tu-frontend.railway.app

# Database conectada
railway run python manage.py dbshell

# No hay errores en logs
railway logs --service backend --level error
railway logs --service frontend --level error
```

---

## 🎉 ¡Listo para Producción!

Si todos los checkboxes están marcados, tu aplicación está lista para usar en Railway.

**URLs Finales:**
- 🎨 Frontend: `https://_____________________.railway.app`
- 🔧 Backend: `https://_____________________.railway.app`
- 👤 Admin: `https://_____________________.railway.app/admin/`

**Credenciales Admin:**
- Usuario: `__________`
- Password: `__________` (guardar en lugar seguro)

---

**Fecha de Despliegue:** _______________

**Desplegado por:** _______________

**Notas adicionales:**
```
_________________________________________________________________

_________________________________________________________________

_________________________________________________________________
```
