import { useEffect, useMemo, useState } from 'react'
import * as catService from '../services/categories'

const COLORS = [
  '#ef4444', '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#f97316', '#06b6d4'
]

function ColorPicker({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-4">
      {COLORS.map(c => (
        <button key={c} type="button" onClick={() => onChange(c)} className={`w-10 h-10 rounded-md border-2 ${value===c ? 'border-gray-600' : 'border-gray-300'}`} style={{ background: c }} />
      ))}
    </div>
  )
}

function TypeToggle({ value, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <button type="button" onClick={() => onChange('income')} className={`border rounded-xl p-6 text-center ${value==='income' ? 'border-green-500 bg-green-50' : ''}`}>
        <div className="text-2xl mb-2">↗️</div>
        <div className="font-medium">Ingreso</div>
      </button>
      <button type="button" onClick={() => onChange('expense')} className={`border rounded-xl p-6 text-center ${value==='expense' ? 'border-red-500 bg-red-50' : ''}`}>
        <div className="text-2xl mb-2">↙️</div>
        <div className="font-medium">Gasto</div>
      </button>
    </div>
  )
}

function CatRow({ it, onDelete }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border rounded-lg bg-white">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-md" style={{ background: it.color }} />
        <div>
          <div className="font-medium">{it.name}</div>
          <div className="text-xs text-gray-500">{it.type === 'income' ? 'Ingreso' : 'Gasto'}</div>
        </div>
      </div>
      <button onClick={() => onDelete(it.id)} className="text-red-600 hover:underline text-sm">Eliminar</button>
    </div>
  )
}

export default function Categories() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ name: '', type: 'expense', color: COLORS[0] })
  const [error, setError] = useState('')

  useEffect(() => {
    (async () => {
      const data = await catService.list()
      setItems(data)
      setLoading(false)
    })()
  }, [])

  const canSave = useMemo(() => form.name && form.type && form.color, [form])

  const save = async (e) => {
    e.preventDefault()
    setError('')
    if (!canSave) { setError('Completa los campos'); return }
    const created = await catService.create(form)
    setItems(prev => [created, ...prev])
    setOpen(false)
    setForm({ name: '', type: 'expense', color: COLORS[0] })
  }

  const remove = async (id) => {
    await catService.remove(id)
    setItems(prev => prev.filter(x => x.id !== id))
  }

  const income = items.filter(i => i.type === 'income')
  const expense = items.filter(i => i.type === 'expense')

  return (
    <div className="px-2 md:px-0">
      <div className="flex items-center justify-between py-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Categorías</h2>
          <p className="text-sm text-gray-600">Organiza tus transacciones por categorías</p>
        </div>
        <button onClick={() => setOpen(true)} className="btn btn-primary flex items-center gap-2">
          <span>＋</span>
          <span>Nueva Categoría</span>
        </button>
      </div>

      {open ? (
        <div className="card p-5 mb-6">
          <form onSubmit={save} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Nombre de la Categoría</label>
              <input value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} placeholder="Ej: Alimentación, Transporte..." className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tipo</label>
              <TypeToggle value={form.type} onChange={(v)=>setForm({...form, type: v})} />
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium mb-2">Color</label>
              <ColorPicker value={form.color} onChange={(c)=>setForm({...form, color: c})} />
            </div>
            {error && <div className="lg:col-span-2 text-red-600 text-sm">{error}</div>}
            <div className="lg:col-span-2 flex items-center justify-end gap-3">
              <button type="button" onClick={()=>setOpen(false)} className="btn">Cancelar</button>
              <button disabled={!canSave} className="btn btn-primary">Crear Categoría</button>
            </div>
          </form>
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border">
          <div className="px-4 py-3 border-b font-semibold">Ingreso</div>
          <div className="p-4 space-y-3">
            {income.length ? income.map(c => <CatRow key={c.id} it={c} onDelete={remove} />) : <div className="text-sm text-gray-500">Aún no hay categorías de ingreso.</div>}
          </div>
        </div>
        <div className="bg-white rounded-xl border">
          <div className="px-4 py-3 border-b font-semibold">Gasto</div>
          <div className="p-4 space-y-3">
            {expense.length ? expense.map(c => <CatRow key={c.id} it={c} onDelete={remove} />) : <div className="text-sm text-gray-500">Aún no hay categorías de gasto.</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
