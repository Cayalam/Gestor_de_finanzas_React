import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3030/api',
})

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

// Auto-inyectar token desde localStorage si existe
const saved = typeof window !== 'undefined' ? localStorage.getItem('token') : null
if (saved) setAuthToken(saved)

export default api
