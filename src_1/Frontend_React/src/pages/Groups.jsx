import { useEffect, useMemo, useState } from 'react'
import * as groupsService from '../services/groups'

export default function Groups() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ nombre: '', descripcion: '' })

  useEffect(() => {
    (async () => {
      const data = await groupsService.list()
      setItems(data)
      setLoading(false)
    })()
  }, [])

  const canSave = useMemo(() => !!form.nombre, [form])

  const save = async (e) => {
    e.preventDefault()
    if (!canSave) return
    const created = await groupsService.create(form)
    setItems(prev => [created, ...prev])
    setOpen(false)
    setForm({ nombre: '', descripcion: '' })
  }

  const remove = async (id) => {
    await groupsService.remove(id)
    setItems(prev => prev.filter(x => x.id !== id))
  }

  return (
    <div className="px-2 md:px-0">
      <div className="flex items-center justify-between py-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Grupos</h2>
          <p className="text-sm text-gray-600">Comparte tus finanzas con otros usuarios</p>
        </div>
        <button onClick={() => setOpen(true)} className="btn btn-primary">+ Nuevo Grupo</button>
      </div>

      {open && (
        <div className="card p-5 mb-6">
          <form onSubmit={save} className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nombre del grupo</label>
              <input value={form.nombre} onChange={(e)=>setForm({...form, nombre: e.target.value})} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Descripción</label>
              <input value={form.descripcion} onChange={(e)=>setForm({...form, descripcion: e.target.value})} className="input" />
            </div>
            <div className="flex items-center justify-end gap-3">
              <button type="button" onClick={()=>setOpen(false)} className="btn">Cancelar</button>
              <button disabled={!canSave} className="btn btn-primary">Crear</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div className="text-sm font-medium">Listado</div>
          {loading && <div className="text-sm text-gray-500">Cargando…</div>}
        </div>
        <div className="p-4 space-y-3">
          {items?.length ? items.map(g => (
            <div key={g.id} className="border rounded-lg p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{g.nombre || g.name}</div>
                {g.descripcion && <div className="text-xs text-gray-500">{g.descripcion}</div>}
              </div>
              <button onClick={()=>remove(g.id)} className="text-red-600 hover:underline text-sm">Eliminar</button>
            </div>
          )) : <div className="text-sm text-gray-500">No tienes grupos creados.</div>}
        </div>
      </div>
    </div>
  )
}
