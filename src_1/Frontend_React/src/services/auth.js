import api, { setAuthToken } from './api'

const API_BASE = import.meta.env.VITE_API_BASE || ''

export async function login(email, password) {
  if (import.meta.env.VITE_DEMO_MODE === 'true') {
    const fakeToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
      btoa(JSON.stringify({ sub: 'demo-user', email, name: 'Usuario Demo', iat: 0, exp: 1893456000 })) +
      '.signature'
    setAuthToken(fakeToken)
    return { token: fakeToken }
  }

  // Preferir endpoint DRF token
  const res = await fetch(`${API_BASE}/api-token-auth/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: email, password }),
  })
  if (!res.ok) throw await res.json().catch(() => ({ detail: 'Login failed' }))
  const data = await res.json()
  const t = data.token
  if (t) setAuthToken(t)
  return data
}

export async function register(payload) {
  if (import.meta.env.VITE_DEMO_MODE === 'true') {
    return { message: 'Usuario creado (demo)' }
  }
  const res = await fetch(`${API_BASE}/api/usuarios/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw await res.json().catch(() => ({ detail: 'Register failed' }))
  const data = await res.json()
  // backend returns token on creation if available
  if (data.token) setAuthToken(data.token)
  return data
}

export default { login, register }
