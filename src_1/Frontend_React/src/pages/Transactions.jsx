import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import * as txService from '../services/transactions'
import * as catService from '../services/categories'
import * as pocketsService from '../services/pockets'

function ToggleType({ value, onChange }) {
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

export default function Transactions() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [form, setForm] = useState({
    id: null,
    type: 'expense',
    amount: '',
    date: new Date().toISOString().slice(0,10),
    category: '',
    pocket: '',
    description: ''
  })
  const [error, setError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null)

  useEffect(() => {
    (async () => {
      const data = await txService.list()
      setItems(data)
      setLoading(false)
    })()
  }, [])

  const [categories, setCategories] = useState([])
  useEffect(() => {
    (async () => {
      const cats = await catService.list()
      setCategories(cats)
    })()
  }, [])

  // Recargar categorías si vuelves a la pestaña o cambian en localStorage
  useEffect(() => {
    const reload = async () => setCategories(await catService.list())
    const onStorage = (e) => { if (e.key === 'demo_categories') reload() }
    const onFocus = () => reload()
    window.addEventListener('storage', onStorage)
    window.addEventListener('focus', onFocus)
    return () => { window.removeEventListener('storage', onStorage); window.removeEventListener('focus', onFocus) }
  }, [])

  // Limpiar categoría si cambias el tipo y la selección ya no aplica
  useEffect(() => {
    if (!categories.find(c => c.type === form.type && c.name === form.category)) {
      setForm(prev => ({ ...prev, category: '' }))
    }
  }, [form.type, categories])

  const [pockets, setPockets] = useState([])
  useEffect(() => {
    (async () => setPockets(await pocketsService.list()))()
  }, [])
  useEffect(() => {
    const reload = async () => setPockets(await pocketsService.list())
    const onStorage = (e) => { if (e.key === 'demo_pockets') reload() }
    const onFocus = () => reload()
    window.addEventListener('storage', onStorage)
    window.addEventListener('focus', onFocus)
    return () => { window.removeEventListener('storage', onStorage); window.removeEventListener('focus', onFocus) }
  }, [])

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const categoriesByType = useMemo(() => categories.filter(c => c.type === form.type), [categories, form.type])
  const canSave = useMemo(() => Number(form.amount) > 0 && form.date && categoriesByType.length > 0 && !!form.category && pockets.length > 0 && !!form.pocket, [form, categoriesByType, pockets])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (categoriesByType.length === 0) {
      setError(`No hay categorías de ${form.type === 'income' ? 'ingreso' : 'gasto'}. Crea una en la sección Categorías.`)
      return
    }
    if (!form.category) { setError('Selecciona una categoría'); return }
    if (pockets.length === 0) { setError('No hay bolsillos creados. Crea uno en la sección Bolsillos.'); return }
    if (!form.pocket) { setError('Selecciona un bolsillo'); return }
    if (!Number(form.amount) || !form.date) { setError('Completa los campos obligatorios'); return }
    
    try {
      // Permitir enviar tanto id como nombre según servicio
      const selectedCat = categoriesByType.find(c => (c.id === form.category || c.name === form.category))
      const selectedPocket = pockets.find(p => (p.id === form.pocket || p.name === form.pocket))
      const payload = { 
        ...form, 
        amount: Number(form.amount),
        categoryId: selectedCat?.id, 
        pocketId: selectedPocket?.id,
      }
      
      if (form.id) {
        // Actualizar transacción existente
        const updated = await txService.update(form.id, form.type, payload)
        setItems(prev => prev.map(x => x.id === updated.id ? updated : x))
      } else {
        // Crear nueva transacción
        const created = await txService.create(payload)
        setItems(prev => [created, ...prev])
      }
      
      setOpen(false)
      setForm({ id: null, type: 'expense', amount: '', date: new Date().toISOString().slice(0,10), category: '', pocket: '', description: '' })
      // trigger dashboard reload in same tab
      localStorage.setItem('demo_transactions', JSON.stringify(JSON.parse(localStorage.getItem('demo_transactions')||'[]')))
    } catch (err) {
      // Capturar errores del backend (ej: saldo insuficiente)
      const detail = err?.response?.data?.detail
      if (detail) {
        setError(detail)
      } else if (err?.response?.data && typeof err.response.data === 'object') {
        // Si es un objeto con múltiples errores
        const errors = Object.values(err.response.data).flat().join(', ')
        setError(errors || 'Error al guardar la transacción')
      } else {
        setError(err?.message || 'Error al guardar la transacción')
      }
    }
  }

  const startEdit = (tx) => {
    setForm({
      id: tx.id,
      type: tx.type,
      amount: String(tx.amount),
      date: tx.date,
      category: tx.categoryId || tx.category,
      pocket: tx.pocketId || tx.pocket,
      description: tx.description || ''
    })
    setOpen(true)
    setError('')
  }

  const remove = async () => {
    if (!confirmDelete) return
    try {
      await txService.remove(confirmDelete.id, confirmDelete.type)
      setItems(prev => prev.filter(x => x.id !== confirmDelete.id))
      localStorage.setItem('demo_transactions', JSON.stringify(JSON.parse(localStorage.getItem('demo_transactions')||'[]')))
      setConfirmDelete(null)
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || 'Error al eliminar la transacción')
      setConfirmDelete(null)
    }
  }

  return (
    <div className="px-2 md:px-0">
      <div className="flex items-center justify-between py-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Transacciones</h2>
          <p className="text-sm text-gray-600">Gestiona tus ingresos y gastos</p>
        </div>
        <button onClick={() => setOpen(true)} className="btn btn-primary flex items-center gap-2">
          <span>＋</span>
          <span>Nueva Transacción</span>
        </button>
      </div>

      {open && (
        <div className="card p-5 mb-6">
          <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium mb-2">Tipo de Transacción</label>
              <ToggleType value={form.type} onChange={(t) => setForm({ ...form, type: t })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Cantidad</label>
              <div className="flex items-center">
                <span className="px-3 py-2 border border-r-0 rounded-l-lg bg-white">€</span>
                <input name="amount" value={form.amount} onChange={onChange} type="number" step="0.01" placeholder="0.00" className="input rounded-r-lg" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Fecha</label>
              <input name="date" value={form.date} onChange={onChange} type="date" className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Categoría</label>
              {categoriesByType.length ? (
                <select name="category" value={form.category} onChange={onChange} className="input">
                  <option value="">Seleccionar categoría</option>
                  {categoriesByType.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              ) : (
                <div className="text-sm text-gray-600">No hay categorías de {form.type === 'income' ? 'ingreso' : 'gasto'}. <Link to="/categories" className="text-blue-600 hover:underline">Crea una</Link>.</div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Bolsillo</label>
              {pockets.length ? (
                <select name="pocket" value={form.pocket} onChange={onChange} className="input">
                  <option value="">Seleccionar bolsillo</option>
                  {pockets.map(p => <option key={p.id} value={p.id}>{p.name || p.nombre}</option>)}
                </select>
              ) : (
                <div className="text-sm text-gray-600">No hay bolsillos creados. <Link to="/pockets" className="text-blue-600 hover:underline">Crea uno</Link>.</div>
              )}
            </div>
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium mb-2">Descripción</label>
              <input name="description" value={form.description} onChange={onChange} placeholder="Descripción de la transacción" className="input" />
            </div>
            {error && <div className="lg:col-span-2 text-red-600 text-sm">{error}</div>}
            <div className="lg:col-span-2 flex items-center justify-end gap-3">
              <button type="button" onClick={() => { setOpen(false); setForm({ id: null, type: 'expense', amount: '', date: new Date().toISOString().slice(0,10), category: '', pocket: '', description: '' }); setError(''); }} className="btn">Cancelar</button>
              <button disabled={!canSave} className="btn btn-primary" type="submit">{form.id ? 'Actualizar transacción' : 'Guardar'}</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div className="text-sm font-medium">Historial</div>
          {loading && <div className="text-sm text-gray-500">Cargando…</div>}
        </div>
        {items.length ? (
          <ul className="divide-y">
            {items.map(it => (
              <li key={it.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{it.description || (it.type==='income' ? 'Ingreso' : 'Gasto')}</div>
                  <div className="text-xs text-gray-500">{it.category || it.categoria?.nombre || 'Sin categoría'} • {it.pocket || it.bolsillo?.nombre || 'Sin bolsillo'} • {new Date(it.date || it.fecha).toLocaleDateString()}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`${it.type==='income' ? 'text-green-600' : 'text-red-600'} font-semibold`}>{it.type==='income' ? '+' : '-'}€ {Number(it.amount).toFixed(2)}</div>
                  <button onClick={() => startEdit(it)} className="text-blue-600 hover:underline text-sm">Editar</button>
                  <button onClick={() => setConfirmDelete(it)} className="text-red-600 hover:underline text-sm">Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-4 py-8 text-sm text-gray-500">Aún no hay transacciones registradas.</div>
        )}
      </div>

      {/* Modal de confirmación de eliminación */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="card p-6 max-w-sm mx-4">
            <div className="text-lg font-semibold mb-2">Confirmar eliminación</div>
            <div className="text-sm text-gray-700 mb-4">
              ¿Eliminar esta transacción de {confirmDelete.type === 'income' ? 'ingreso' : 'gasto'} por €{Number(confirmDelete.amount).toFixed(2)}? Esta acción no se puede deshacer.
            </div>
            <div className="flex justify-end gap-3">
              <button className="btn" onClick={() => setConfirmDelete(null)}>Cancelar</button>
              <button className="btn btn-danger" onClick={remove}>Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
