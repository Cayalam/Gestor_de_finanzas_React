# 💰 FinanzApp - Gestor de Finanzas Inteligente

[![Python](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-5.2.7-green.svg)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> Sistema completo de gestión financiera personal y grupal con Django REST Framework y React

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Endpoints](#-api-endpoints)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)
- [Autores](#-autores)

## ✨ Características

### 💼 Gestión Personal
- **Dashboard Personalizado**: Visualiza tu situación financiera con gráficos interactivos
- **Ingresos y Gastos**: Registra y categoriza todas tus transacciones
- **Bolsillos Virtuales**: Organiza tu dinero en diferentes categorías (ahorros, gastos, etc.)
- **Categorías Personalizadas**: Crea y personaliza categorías con colores únicos
- **Estadísticas Avanzadas**: Análisis mensual y anual de ingresos/gastos

### 👥 Gestión Grupal
- **Grupos Compartidos**: Crea grupos para gestionar finanzas familiares o con amigos
- **Roles y Permisos**: Administradores y miembros con diferentes niveles de acceso
- **Aportaciones al Grupo**: Sistema de contribuciones entre miembros
- **Transferencias**: Envía dinero entre tu cuenta personal y grupos
- **Trazabilidad**: Cada transacción muestra quién la realizó

### 🎨 Experiencia de Usuario
- **Interfaz Moderna**: Diseño limpio con gradientes y animaciones
- **Responsive**: Perfectamente adaptado para móvil, tablet y desktop
- **Modo Personal/Grupo**: Cambia fácilmente entre contextos
- **Mensaje de Bienvenida**: Saludo personalizado con tu nombre
- **Verificación de Backend**: Detecta automáticamente si el servidor está activo

### 🔒 Seguridad
- **Autenticación por Token**: Sistema seguro de autenticación
- **Validación de Datos**: Verificación en frontend y backend
- **Restricciones XOR**: Modelo de datos que garantiza integridad
- **Permisos Granulares**: Control de acceso basado en roles

## 🛠️ Tecnologías

### Backend
- **Django 5.2.7**: Framework web de Python
- **Django REST Framework 3.15.2**: API RESTful
- **SQLite**: Base de datos (desarrollo)
- **Token Authentication**: Sistema de autenticación

### Frontend
- **React 18**: Biblioteca de UI
- **Vite**: Build tool y dev server
- **React Router**: Navegación SPA
- **Axios**: Cliente HTTP
- **Tailwind CSS**: Framework de estilos
- **Recharts**: Gráficos y visualizaciones

## 📦 Requisitos Previos

- **Python**: 3.12 o superior
- **Node.js**: 18 o superior
- **npm**: 9 o superior
- **Git**: Para clonar el repositorio

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Cayalam/Gestor_de_finanzas_React.git
cd Gestor_de_finanzas_React/src_1
```

### 2. Configurar el Backend

```bash
# Navegar a la carpeta del backend
cd Backend_Django

# Crear entorno virtual
python -m venv .venv

# Activar entorno virtual
# En Windows:
.venv\Scripts\activate
# En macOS/Linux:
source .venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Aplicar migraciones
python manage.py migrate

# Crear superusuario (opcional)
python manage.py createsuperuser

# Iniciar servidor de desarrollo
python manage.py runserver
```

El backend estará disponible en `http://localhost:8000`

### 3. Configurar el Frontend

```bash
# Abrir una nueva terminal y navegar al frontend
cd Frontend_React

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará disponible en `http://localhost:3000`

## ⚙️ Configuración

### Variables de Entorno

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000/api
VITE_DEMO_MODE=false
```

#### Backend (settings.py)
Las configuraciones principales están en `backend/settings.py`:
- `ALLOWED_HOSTS`: Hosts permitidos
- `CORS_ALLOWED_ORIGINS`: Orígenes permitidos para CORS
- `SECRET_KEY`: Clave secreta de Django

## 📖 Uso

### Registro e Inicio de Sesión

1. Abre `http://localhost:3000` en tu navegador
2. Haz clic en "Registrarse"
3. Completa el formulario con:
   - Email
   - Nombre
   - Contraseña
   - Divisa preferida (COP, USD, EUR, etc.)
4. Inicia sesión con tus credenciales

### Crear un Bolsillo

1. Ve a la sección "Bolsillos"
2. Haz clic en "Nuevo Bolsillo"
3. Ingresa nombre, monto inicial y selecciona un color
4. El bolsillo "General" se crea automáticamente

### Registrar Transacciones

1. Ve a la sección "Transacciones"
2. Selecciona "Ingreso" o "Egreso"
3. Completa los datos:
   - Descripción
   - Monto
   - Categoría
   - Bolsillo
   - Fecha
4. La transacción se guarda automáticamente

### Crear un Grupo

1. Ve a la sección "Grupos"
2. Haz clic en "Nuevo Grupo"
3. Ingresa nombre y descripción
4. Agrega miembros por email
5. Asigna roles (admin/miembro)

### Cambiar entre Personal y Grupo

1. Usa el selector en el header
2. Selecciona "Personal" o el grupo deseado
3. Todos los datos se filtran automáticamente

## 📁 Estructura del Proyecto

```
src_1/
├── Backend_Django/           # Backend Django
│   ├── backend/             # Configuración del proyecto
│   │   ├── settings.py      # Configuración principal
│   │   ├── urls.py          # URLs principales
│   │   └── wsgi.py          # WSGI config
│   ├── finances/            # App principal
│   │   ├── models.py        # Modelos de datos
│   │   ├── serializers.py   # Serializadores DRF
│   │   ├── views.py         # Vistas y ViewSets
│   │   └── migrations/      # Migraciones de BD
│   ├── .venv/              # Entorno virtual
│   ├── db.sqlite3          # Base de datos
│   ├── manage.py           # CLI de Django
│   └── requirements.txt    # Dependencias Python
│
├── Frontend_React/          # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── BackendStatus.jsx
│   │   │   └── ...
│   │   ├── pages/          # Páginas principales
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Transactions.jsx
│   │   │   ├── Groups.jsx
│   │   │   └── ...
│   │   ├── context/        # Context API
│   │   │   ├── AuthContext.jsx
│   │   │   └── GroupContext.jsx
│   │   ├── services/       # Servicios API
│   │   │   ├── api.js
│   │   │   ├── auth.js
│   │   │   ├── transactions.js
│   │   │   └── ...
│   │   ├── utils/          # Utilidades
│   │   └── App.jsx         # Componente raíz
│   ├── package.json        # Dependencias npm
│   └── vite.config.js      # Configuración Vite
│
└── README.md               # Este archivo
```

## 🔌 API Endpoints

### Autenticación
- `POST /api-token-auth/` - Obtener token de autenticación
- `POST /api/register/` - Registrar nuevo usuario
- `GET /api/usuarios/me/` - Obtener usuario actual

### Usuarios
- `GET /api/usuarios/` - Listar usuarios
- `POST /api/usuarios/` - Crear usuario
- `GET /api/usuarios/{id}/` - Obtener usuario
- `PUT /api/usuarios/{id}/` - Actualizar usuario
- `DELETE /api/usuarios/{id}/` - Eliminar usuario

### Grupos
- `GET /api/grupos/` - Listar grupos del usuario
- `POST /api/grupos/` - Crear grupo
- `GET /api/grupos/{id}/` - Obtener grupo
- `PUT /api/grupos/{id}/` - Actualizar grupo
- `DELETE /api/grupos/{id}/` - Eliminar grupo

### Bolsillos
- `GET /api/bolsillos/?grupo_id={id}` - Listar bolsillos (personal o grupo)
- `POST /api/bolsillos/` - Crear bolsillo
- `PUT /api/bolsillos/{id}/` - Actualizar bolsillo
- `DELETE /api/bolsillos/{id}/` - Eliminar bolsillo

### Transacciones
- `GET /api/ingresos/?grupo_id={id}` - Listar ingresos
- `POST /api/ingresos/` - Crear ingreso
- `GET /api/egresos/?grupo_id={id}` - Listar egresos
- `POST /api/egresos/` - Crear egreso

### Categorías
- `GET /api/categorias/` - Listar categorías
- `POST /api/categorias/` - Crear categoría
- `PUT /api/categorias/{id}/` - Actualizar categoría
- `DELETE /api/categorias/{id}/` - Eliminar categoría

### Usuario-Grupo
- `GET /api/usuario-grupo/` - Listar membresías
- `POST /api/usuario-grupo/agregar_por_email/` - Agregar usuario por email
- `POST /api/usuario-grupo/cambiar_rol/` - Cambiar rol de usuario

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autores

- **Ivan Perez** - *Desarrollo Principal* - [Cayalam](https://github.com/Cayalam)

## 🙏 Agradecimientos

- Universidad Industrial de Santander
- Comunidad de Django y React
- Todos los contribuidores

---

⭐️ Si este proyecto te fue útil, considera darle una estrella en GitHub!

📧 Para preguntas o sugerencias: [crear un issue](https://github.com/Cayalam/Gestor_de_finanzas_React/issues)
