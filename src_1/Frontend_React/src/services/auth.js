import api, { setAuthToken } from './api'

export async function login(email, password) {
  if (import.meta.env.VITE_DEMO_MODE === 'true') {
    const fakeToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
      btoa(JSON.stringify({ sub: 'demo-user', email, name: 'Usuario Demo', iat: 0, exp: 1893456000 })) +
      '.signature'
    setAuthToken(fakeToken)
    return { token: fakeToken }
  }

  // Usar axios client ya configurado para respetar baseURL y headers
  const res = await api.post('/api-token-auth/', { username: email, password })
  const data = res.data
  if (data.token) setAuthToken(data.token)
  return data
}

export async function register(payload) {
  if (import.meta.env.VITE_DEMO_MODE === 'true') {
    return { message: 'Usuario creado (demo)' }
  }
  const res = await api.post('/register/', payload)
  const data = res.data
  if (data.token) setAuthToken(data.token)
  return data
}

export default { login, register }
