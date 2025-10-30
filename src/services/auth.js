import api, { setAuthToken } from './api'

export async function login(email, password) {
  if (import.meta.env.VITE_DEMO_MODE === 'true') {
    // token de demo con payload mínimo
    const fakeToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
      btoa(JSON.stringify({ sub: 'demo-user', email, name: 'Usuario Demo', iat: 0, exp: 1893456000 })) +
      '.signature'
    return { token: fakeToken }
  }
  const { data } = await api.post('/auth/login', { email, password })
  // Si backend devuelve token, configurarlo para siguientes llamadas
  const t = data?.token || data?.accessToken
  if (t) setAuthToken(t)
  return data
}

export async function register(payload) {
  if (import.meta.env.VITE_DEMO_MODE === 'true') {
    return { message: 'Usuario creado (demo)' }
  }
  const { data } = await api.post('/auth/register', payload)
  return data
}

export default { login, register }
