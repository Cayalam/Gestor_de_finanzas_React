import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
})

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Token ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

// Auto-inyectar token desde localStorage si existe
const saved = typeof window !== 'undefined' ? localStorage.getItem('token') : null
if (saved) setAuthToken(saved)

export default api
