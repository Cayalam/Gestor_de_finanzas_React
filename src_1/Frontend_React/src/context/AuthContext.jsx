import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import * as authService from '../services/auth'
import { setAuthToken } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '')
  const [user, setUser] = useState(() => {
    const t = localStorage.getItem('token')
    if (!t) return null
    try { return jwtDecode(t) } catch { return null }
  })
  const [loading, setLoading] = useState(false)
  const isAuthenticated = !!token

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      try {
        const decoded = jwtDecode(token)
        setUser(decoded)
      } catch {
        setUser(null)
      }
      setAuthToken(token)
    } else {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setUser(null)
      setAuthToken('')
    }
  }, [token])

  const login = async (email, password) => {
    setLoading(true)
    try {
      const data = await authService.login(email, password)
      const t = data?.token || data?.accessToken || ''
      if (!t) throw new Error('Token no recibido')
      setToken(t)
      return data
    } finally {
      setLoading(false)
    }
  }

  const register = async (payload) => {
    setLoading(true)
    try {
      return await authService.register(payload)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setToken('')
  }

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated,
      loading,
      login,
      register,
      logout
    }),
    [token, user, isAuthenticated, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
