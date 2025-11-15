# 💰 FinanzApp - Gestor de Finanzas Inteligente# 💰 FinanzApp - Gestor de Finanzas Inteligente



[![Python](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)[![Python](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)

[![Django](https://img.shields.io/badge/Django-5.2.7-green.svg)](https://www.djangoproject.com/)[![Django](https://img.shields.io/badge/Django-5.2.7-green.svg)](https://www.djangoproject.com/)

[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://reactjs.org/)[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://reactjs.org/)

[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)



> Sistema completo de gestión financiera personal y grupal desarrollado con Django REST Framework y React> Sistema completo de gestión financiera personal y grupal desarrollado con Django REST Framework y React



**FinanzApp** es una aplicación web moderna que te permite gestionar tus finanzas personales y compartir gastos con grupos (familia, amigos, compañeros). Con una interfaz intuitiva, categorización automática y visualización de estadísticas en tiempo real.**FinanzApp** es una aplicación web moderna que te permite gestionar tus finanzas personales y compartir gastos con grupos (familia, amigos, compañeros). Con una interfaz intuitiva, categorización automática y visualización de estadísticas en tiempo real.



## 📸 Vista Previa## � Vista Previa



``````

┌─────────────────────────────────────────────┐┌─────────────────────────────────────────────┐

│  Dashboard Personalizado                   ││  Dashboard Personalizado                   │

│  ✓ Ingresos y Egresos                      ││  ✓ Ingresos y Egresos                      │

│  ✓ Bolsillos Virtuales                     ││  ✓ Bolsillos Virtuales                     │

│  ✓ Gráficos Interactivos                   ││  ✓ Gráficos Interactivos                   │

│  ✓ Gestión de Grupos                       ││  ✓ Gestión de Grupos                       │

└─────────────────────────────────────────────┘└─────────────────────────────────────────────┘

``````



## ✨ Características Principales## ✨ Características Principales



### 💼 Gestión Personal### 💼 Gestión Personal

- 📊 Dashboard con estadísticas en tiempo real- 📊 Dashboard con estadísticas en tiempo real

- 💸 Registro de ingresos y gastos- 💸 Registro de ingresos y gastos

- 🏦 Múltiples bolsillos/cuentas virtuales- 🏦 Múltiples bolsillos/cuentas virtuales

- 🎨 Categorías personalizables con colores- 🎨 Categorías personalizables con colores

- 📈 Gráficos de gastos por categoría- 📈 Gráficos de gastos por categoría



### 👥 Gestión Grupal### 👥 Gestión Grupal

- 👨‍👩‍👧‍👦 Crear y administrar grupos familiares o de amigos- 👨‍👩‍👧‍👦 Crear y administrar grupos familiares o de amigos

- 💰 Compartir gastos y llevar cuentas conjuntas- 💰 Compartir gastos y llevar cuentas conjuntas

- 🔍 Trazabilidad: ver quién realizó cada transacción- 🔍 Trazabilidad: ver quién realizó cada transacción

- 🔐 Roles y permisos por grupo- 🔐 Roles y permisos por grupo

- 📤 Transferencias entre usuarios- 📤 Transferencias entre usuarios



### 🎯 Experiencia de Usuario### 🎯 Experiencia de Usuario

- 📱 Diseño responsive (móvil, tablet, desktop)- 📱 Diseño responsive (móvil, tablet, desktop)

- 🌓 Interfaz moderna con Tailwind CSS- 🌓 Interfaz moderna con Tailwind CSS

- ⚡ Carga rápida con React + Vite- ⚡ Carga rápida con React + Vite

- 🔔 Notificaciones de estado del backend- 🔔 Notificaciones de estado del backend

- 🌍 Soporte para múltiples divisas- 🌍 Soporte para múltiples divisas



## 📋 Tabla de Contenidos## 📋 Tabla de Contenidos



- [Inicio Rápido](#-inicio-rápido)- [Inicio Rápido](#-inicio-rápido)

- [Tecnologías](#️-tecnologías)- [Tecnologías](#️-tecnologías)

- [Documentación Completa](#-documentación-completa)- [Documentación Completa](#-documentación-completa)

- [Contribuir](#-contribuir)- [Contribuir](#-contribuir)

- [Licencia](#-licencia)- [Licencia](#-licencia)



## 🚀 Inicio Rápido## ✨ Características



### Requisitos Previos### 💼 Gestión Personal

- **Dashboard Personalizado**: Visualiza tu situación financiera con gráficos interactivos

- Python 3.12+- **Ingresos y Gastos**: Registra y categoriza todas tus transacciones

- Node.js 18+- **Bolsillos Virtuales**: Organiza tu dinero en diferentes categorías (ahorros, gastos, etc.)

- npm 9+- **Categorías Personalizadas**: Crea y personaliza categorías con colores únicos

- **Estadísticas Avanzadas**: Análisis mensual y anual de ingresos/gastos

### Instalación en 3 Pasos

### 👥 Gestión Grupal

**1. Clonar el repositorio**- **Grupos Compartidos**: Crea grupos para gestionar finanzas familiares o con amigos

```bash- **Roles y Permisos**: Administradores y miembros con diferentes niveles de acceso

git clone https://github.com/Cayalam/Gestor_de_finanzas_React.git- **Aportaciones al Grupo**: Sistema de contribuciones entre miembros

cd Gestor_de_finanzas_React- **Transferencias**: Envía dinero entre tu cuenta personal y grupos

```- **Trazabilidad**: Cada transacción muestra quién la realizó



**2. Configurar Backend**### 🎨 Experiencia de Usuario

```bash- **Interfaz Moderna**: Diseño limpio con gradientes y animaciones

cd src_1/Backend_Django- **Responsive**: Perfectamente adaptado para móvil, tablet y desktop

python -m venv env- **Modo Personal/Grupo**: Cambia fácilmente entre contextos

env\Scripts\activate  # Windows- **Mensaje de Bienvenida**: Saludo personalizado con tu nombre

pip install -r requirements.txt- **Verificación de Backend**: Detecta automáticamente si el servidor está activo

python manage.py migrate

python manage.py runserver### 🔒 Seguridad

```- **Autenticación por Token**: Sistema seguro de autenticación

- **Validación de Datos**: Verificación en frontend y backend

**3. Configurar Frontend**- **Restricciones XOR**: Modelo de datos que garantiza integridad

```bash- **Permisos Granulares**: Control de acceso basado en roles

cd src_1/Frontend_React

npm install## 🛠️ Tecnologías

echo "VITE_API_URL=http://localhost:8000/api" > .env

npm run dev### Backend

```- **Django 5.2.7**: Framework web de Python

- **Django REST Framework 3.15.2**: API RESTful

🎉 **¡Listo!** Abre http://localhost:3000 en tu navegador- **SQLite**: Base de datos (desarrollo)

- **Token Authentication**: Sistema de autenticación

> 💡 Para instrucciones detalladas, consulta la [Guía de Instalación](docs/installation.md)

### Frontend

## 🛠️ Tecnologías- **React 18**: Biblioteca de UI

- **Vite**: Build tool y dev server

### Backend- **React Router**: Navegación SPA

- **Django 5.2.7** - Framework web- **Axios**: Cliente HTTP

- **Django REST Framework 3.15.2** - API REST- **Tailwind CSS**: Framework de estilos

- **SQLite** - Base de datos (desarrollo)- **Recharts**: Gráficos y visualizaciones

- **Token Authentication** - Seguridad

## 📦 Requisitos Previos

### Frontend

- **React 18** - Biblioteca de UI- **Python**: 3.12 o superior

- **Vite** - Build tool moderno- **Node.js**: 18 o superior

- **Tailwind CSS** - Framework de estilos- **npm**: 9 o superior

- **Axios** - Cliente HTTP- **Git**: Para clonar el repositorio

- **React Router** - Navegación SPA

## 🚀 Instalación

## 📚 Documentación Completa

### 1. Clonar el Repositorio

Toda la documentación detallada está disponible en la carpeta [`docs/`](docs/) y en la [Wiki del proyecto](https://github.com/Cayalam/Gestor_de_finanzas_React/wiki):

```bash

| Documento | Descripción |git clone https://github.com/Cayalam/Gestor_de_finanzas_React.git

|-----------|-------------|cd Gestor_de_finanzas_React/src_1

| [📖 Guía de Instalación](docs/installation.md) | Instalación paso a paso con solución de problemas |```

| [🏗️ Arquitectura](docs/architecture.md) | Diseño del sistema y modelo de datos |

| [👤 Guía de Usuario](docs/user-guide.md) | Manual completo para usuarios finales |### 2. Configurar el Backend

| [🔌 Referencia de API](docs/api-reference.md) | Documentación completa de endpoints |

| [💻 Guía de Desarrollo](docs/development.md) | Configuración del entorno de desarrollo |```bash

# Navegar a la carpeta del backend

## 🤝 Contribuircd Backend_Django



¡Las contribuciones son bienvenidas! Por favor lee nuestra [Guía de Contribución](CONTRIBUTING.md) para conocer:# Crear entorno virtual

python -m venv .venv

- 📝 Convenciones de código

- 🔀 Proceso de Pull Requests# Activar entorno virtual

- 🐛 Cómo reportar bugs# En Windows:

- ✨ Cómo proponer nuevas características.venv\Scripts\activate

# En macOS/Linux:

### Pasos Rápidos para Contribuirsource .venv/bin/activate



1. Fork el proyecto# Instalar dependencias

2. Crea tu rama (`git checkout -b feature/AmazingFeature`)pip install -r requirements.txt

3. Commit tus cambios (`git commit -m 'feat: agregar característica increíble'`)

4. Push a la rama (`git push origin feature/AmazingFeature`)# Aplicar migraciones

5. Abre un Pull Requestpython manage.py migrate



## 📄 Licencia# Crear superusuario (opcional)

python manage.py createsuperuser

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

# Iniciar servidor de desarrollo

## 👨‍💻 Autorpython manage.py runserver

```

**Carlos Eduardo Ayala Moreno** - *Desarrollo Principal* - [Cayalam](https://github.com/Cayalam)

El backend estará disponible en `http://localhost:8000`

## 🙏 Agradecimientos

### 3. Configurar el Frontend

- Universidad Industrial de Santander

- Comunidad de Django y React```bash

- Todos los contribuidores# Abrir una nueva terminal y navegar al frontend

cd Frontend_React

---

# Instalar dependencias

⭐️ **Si este proyecto te fue útil, considera darle una estrella en GitHub!**npm install



📧 **¿Preguntas o sugerencias?** [Crear un issue](https://github.com/Cayalam/Gestor_de_finanzas_React/issues)# Iniciar servidor de desarrollo

npm run dev

📖 **Más información:** [Visita nuestra Wiki](https://github.com/Cayalam/Gestor_de_finanzas_React/wiki)```


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

- **Carlos Eduardo Ayala Moreno** - *Desarrollo Principal* - [Cayalam](https://github.com/Cayalam)

## 🙏 Agradecimientos

- Universidad Industrial de Santander
- Comunidad de Django y React
- Todos los contribuidores

---

⭐️ Si este proyecto te fue útil, considera darle una estrella en GitHub!

📧 Para preguntas o sugerencias: [crear un issue](https://github.com/Cayalam/Gestor_de_finanzas_React/issues)
