import { useEffect, useMemo, useState } from 'react'
import { useGroup } from '../context/GroupContext'
import * as pocketsService from '../services/pockets'

const eur = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' })

function Icon({ name, className = 'w-6 h-6' }) {
  switch (name) {
    case 'wallet':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M21 7H3a2 2 0 0 0-2 2v6a4 4 0 0 0 4 4h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2Zm-1 7h-3a2 2 0 1 1 0-4h3v4Z"/>
          <path d="M17 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"/>
        </svg>
      )
    case 'savings':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M21 11h-1.28a8 8 0 1 0-13.9 4H3v4h3v-1h12v1h3v-4h-1v-4ZM9 9h3V7H9V5H7v2H5v2h2v2h2V9Z"/>
        </svg>
      )
    case 'card':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2H2V6Zm20 4H2v8a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-8ZM6 16h5v2H6v-2Z"/>
        </svg>
      )
    case 'cash':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="M3 6h18v12H3z"/>
          <circle cx="12" cy="12" r="3" fill="#fff"/>
        </svg>
      )
    default:
      return null
  }
}

const ICONS = [
  { id: 'wallet', label: 'Billetera' },
  { id: 'savings', label: 'Ahorros' },
  { id: 'card', label: 'Tarjeta' },
  { id: 'cash', label: 'Efectivo' },
]

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#f97316', '#ef4444', '#06b6d4']

export default function Pockets() {
  const { activeGroup } = useGroup()
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ id: null, name: '', color: COLORS[0], balance: 0, icon: 'wallet' })
  const [error, setError] = useState('')

  useEffect(() => {
    (async () => {
      const data = await pocketsService.list(activeGroup)
      setItems(data)
      setLoading(false)
    })()
  }, [activeGroup]) // Recargar cuando cambie el grupo activo

  const total = useMemo(() => items.reduce((acc, it) => acc + Number(it.balance || 0), 0), [items])
  const canSave = useMemo(() => form.name && form.icon && form.color, [form])

  const save = async (e) => {
    e.preventDefault()
    setError('')
    if (!canSave) { setError('Completa los campos requeridos'); return }
    if (form.id) {
      // actualizar
      try {
        // enviar solo campos modificados para evitar conflictos de unicidad
        const orig = items.find(x => x.id === form.id) || {}
        const payload = {}
        if ((form.name || '') !== (orig.name || '')) payload.name = form.name
        if ((form.color || '') !== (orig.color || '')) payload.color = form.color
        if ((form.icon || '') !== (orig.icon || '')) payload.icon = form.icon
        if (Number(form.balance || 0) !== Number(orig.balance || 0)) payload.balance = Number(form.balance || 0)
        const updated = await pocketsService.update(form.id, payload)
        setItems(prev => prev.map(p => p.id === updated.id ? updated : p))
        setOpen(false)
        setForm({ id: null, name: '', color: COLORS[0], balance: 0, icon: 'wallet' })
      } catch (err) {
        const msg = err?.response?.data?.detail || err?.message || 'Error al actualizar el bolsillo'
        setError(msg)
      }
    } else {
      const created = await pocketsService.create({ name: form.name, color: form.color, balance: Number(form.balance || 0), icon: form.icon })
      setItems(prev => [created, ...prev])
      setOpen(false)
      setForm({ id: null, name: '', color: COLORS[0], balance: 0, icon: 'wallet' })
    }
    localStorage.setItem('demo_pockets', JSON.stringify(JSON.parse(localStorage.getItem('demo_pockets') || '[]')))
  }

  const [confirmId, setConfirmId] = useState(null)
  const remove = async (id) => {
    setError('')
    setConfirmId(id)
  }
  const confirmRemove = async () => {
    try {
      await pocketsService.remove(confirmId)
      setItems(prev => prev.filter(x => x.id !== confirmId))
      localStorage.setItem('demo_pockets', JSON.stringify(JSON.parse(localStorage.getItem('demo_pockets') || '[]')))
      setConfirmId(null)
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || 'Error al eliminar el bolsillo'
      setError(msg)
      setConfirmId(null)
    }
  }

  return (
    <div className="px-2 md:px-0">
      <div className="flex items-center justify-between py-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Bolsillos</h2>
          <p className="text-sm text-gray-600">Gestiona tus cuentas y balances</p>
        </div>
        <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2h6Z"/></svg>
          Nuevo Bolsillo
        </button>
      </div>

      <div className="mb-6">
        <div className="rounded-2xl p-6 text-white shadow" style={{ background: 'linear-gradient(90deg,#3b82f6,#2563eb)' }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-blue-100 font-medium">Balance Total</div>
              <div className="text-3xl md:text-4xl font-extrabold mt-1">{eur.format(total)}</div>
            </div>
            <div className="bg-white/20 rounded-xl p-3">
              <Icon name="wallet" className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {open && (
        <div className="card p-5 mb-6">
          <form onSubmit={save} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Nombre del Bolsillo</label>
              <input value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} placeholder="Ej: Cuenta Principal, Ahorros..." className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Balance Inicial</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">€</span>
                <input type="number" step="0.01" value={form.balance} onChange={(e)=>setForm({...form, balance: e.target.value})} className="input pl-8" />
              </div>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium mb-2">Icono</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {ICONS.map(opt => (
                  <button type="button" key={opt.id} onClick={() => setForm({ ...form, icon: opt.id })} className={`border rounded-xl p-4 flex flex-col items-center gap-3 hover:bg-gray-100 ${form.icon === opt.id ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : ''}`}>
                    <Icon name={opt.id} className="w-8 h-8" />
                    <span className="text-sm">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-sm font-medium mb-2">Color</label>
              <div className="flex flex-wrap gap-4">
                {COLORS.map(c => (
                  <button type="button" key={c} onClick={() => setForm({ ...form, color: c })} className={`w-14 h-14 rounded-xl border shadow-sm`} style={{ background: c, boxShadow: form.color === c ? '0 0 0 4px rgba(59,130,246,0.5)' : undefined }} aria-label={`Color ${c}`}></button>
                ))}
              </div>
            </div>

            {error && <div className="lg:col-span-2 text-red-600 text-sm">{error}</div>}
            <div className="lg:col-span-2 flex items-center justify-end gap-3">
              <button type="button" onClick={()=>setOpen(false)} className="btn btn-ghost">Cancelar</button>
              <button disabled={!canSave} className={`btn btn-primary inline-flex items-center gap-2 ${!canSave ? 'opacity-60 cursor-not-allowed' : ''}`}>
                <Icon name="wallet" className="w-5 h-5" />
                {form.id ? 'Actualizar Bolsillo' : 'Crear Bolsillo'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card p-4">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div className="text-sm font-medium">Listado</div>
          {loading && <div className="text-sm text-gray-500">Cargando…</div>}
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.length ? items.map(p => (
            <div key={p.id} className="border rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white" style={{ background: p.color }}>
                  <Icon name={p.icon || 'wallet'} className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-gray-500">Saldo: {eur.format(Number(p.balance || 0))}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={()=>{ setForm({ id: p.id, name: p.name, color: p.color, balance: p.balance, icon: p.icon }); setOpen(true); setError('') }} className="btn btn-ghost text-sm">Editar</button>
                <button onClick={()=>remove(p.id)} className="btn btn-danger text-sm">Eliminar</button>
              </div>
            </div>
          )) : <div className="text-sm text-gray-500">Aún no hay bolsillos.</div>}
        </div>
      </div>
      {/* Confirm modal */}
      {confirmId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="card p-6 max-w-sm">
            <div className="text-lg font-semibold mb-2">Confirmar eliminación</div>
            <div className="text-sm text-gray-700 mb-4">¿Eliminar este bolsillo? Esta acción no se puede deshacer.</div>
            <div className="flex justify-end gap-3">
              <button className="btn" onClick={() => setConfirmId(null)}>Cancelar</button>
              <button className="btn btn-danger" onClick={confirmRemove}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
