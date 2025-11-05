import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) {
      setError('Completa todos los campos')
      return
    }
    try {
      setLoading(true)
  await login(form.email, form.password)
  navigate('/dashboard')
    } catch (err) {
      setError(err?.response?.data?.message || 'Credenciales inválidas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Iniciar sesión</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1" htmlFor="email">Correo</label>
          <input id="email" name="email" type="email" value={form.email} onChange={onChange} className="w-full border rounded px-3 py-2" placeholder="tu@correo.com" />
        </div>
        <div>
          <label className="block text-sm mb-1" htmlFor="password">Contraseña</label>
          <input id="password" name="password" type="password" value={form.password} onChange={onChange} className="w-full border rounded px-3 py-2" placeholder="••••••••" />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button disabled={loading} className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
      <p className="text-sm mt-4">¿No tienes cuenta? <Link to="/register" className="text-blue-600 hover:underline">Regístrate</Link></p>
    </div>
  )
}
