# Finanzas Frontend

Aplicación React (Vite + Tailwind) con autenticación (login/registro).

## Requisitos

- Node.js 18+
- Backend con endpoints:
	- `POST /auth/login` -> `{ token }`
	- `POST /auth/register` -> `{ message | token }`

## Variables de entorno

Crea `.env` en la raíz basado en `.env.example`:

```
VITE_API_URL=http://localhost:3030/api
VITE_DEMO_MODE=false
```

## Scripts

```
npm install
npm run dev
npm run build
npm run preview
```

## Estructura relevante

- `src/pages/Login.jsx` y `src/pages/Register.jsx`: Formularios de autenticación.
- `src/services/auth.js`: Llamadas HTTP al backend.
- `src/context/AuthContext.jsx`: Estado global de auth, `login`, `register`, `logout`.
- `src/components/ProtectedRoute.jsx`: Protege rutas privadas.
- `src/App.jsx`: Rutas y layout básico.

## Notas

- Se guarda el token en `localStorage` bajo la clave `token` y se decodifica con `jwt-decode`.
- El cliente HTTP añade `Authorization: Bearer <token>` automáticamente.
- Ajusta `VITE_API_URL` según tu backend (por defecto `http://localhost:3030/api`).
- Con `VITE_DEMO_MODE=true` puedes probar sin backend (usa localStorage).
