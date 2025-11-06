import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError('Completa todos los campos')
      return
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden')
      return
    }
    try {
      setLoading(true)
      await register({ name: form.name, email: form.email, password: form.password })
      navigate('/login')
    } catch (err) {
      setError(err?.response?.data?.message || 'No se pudo registrar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card p-6">
        <h2 className="text-2xl font-bold mb-4">Crear cuenta</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1" htmlFor="name">Nombre</label>
            <input id="name" name="name" value={form.name} onChange={onChange} className="input" placeholder="Tu nombre" />
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="email">Correo</label>
            <input id="email" name="email" type="email" value={form.email} onChange={onChange} className="input" placeholder="tu@correo.com" />
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="password">Contraseña</label>
            <input id="password" name="password" type="password" value={form.password} onChange={onChange} className="input" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="confirm">Confirmar contraseña</label>
            <input id="confirm" name="confirm" type="password" value={form.confirm} onChange={onChange} className="input" placeholder="••••••••" />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button disabled={loading} className="btn btn-primary w-full">
            {loading ? 'Creando…' : 'Crear cuenta'}
          </button>
        </form>
        <p className="text-sm mt-4">¿Ya tienes cuenta? <Link to="/login" className="text-blue-600 hover:underline">Inicia sesión</Link></p>
      </div>
    </div>
  )
}
