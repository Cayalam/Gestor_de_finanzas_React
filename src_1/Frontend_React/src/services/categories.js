import api from './api'
const LS_KEY = 'demo_categories'

function readLS() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]') } catch { return [] }
}
function writeLS(items) {
  localStorage.setItem(LS_KEY, JSON.stringify(items))
  // trigger listeners (dashboard/others)
  localStorage.setItem(LS_KEY, JSON.stringify(items))
}

function normalizeCategory(data) {
  if (!data) return null
  const id = data.categoria_id ?? data.id
  const name = data.nombre ?? data.name
  const tipo = (data.tipo || '').toString().toLowerCase()
  const type = tipo.includes('ing') ? 'income' : 'expense'
  return { id, name, type, color: data.color || '#ef4444' }
}

export async function list() {
  if (import.meta.env.VITE_DEMO_MODE === 'true') return readLS()
  const { data } = await api.get('/categorias/')
  // Normalizar a {id, name, type, color}
  return (data || []).map(c => normalizeCategory(c))
}

export async function create(category) {
  if (import.meta.env.VITE_DEMO_MODE === 'true') {
    const items = readLS()
    const newItem = { id: crypto.randomUUID(), ...category, createdAt: new Date().toISOString() }
    items.unshift(newItem)
    writeLS(items)
    return newItem
  }
  const payload = {
    nombre: category.name ?? category.nombre,
    // Backend expects 'ing' for ingreso and 'eg' for egreso
    tipo: category.type ? (category.type === 'income' ? 'ing' : 'eg') : category.tipo,
  }
  const { data } = await api.post('/categorias/', payload)
  return normalizeCategory(data)
}

export async function remove(id) {
  if (import.meta.env.VITE_DEMO_MODE === 'true') {
    const items = readLS().filter(x => x.id !== id)
    writeLS(items)
    return { ok: true }
  }
  const { data } = await api.delete(`/categorias/${id}/`)
  return data
}

export async function getById(id) {
  if (import.meta.env.VITE_DEMO_MODE === 'true') return readLS().find(x=>x.id===id)
  const { data } = await api.get(`/categorias/${id}/`)
  return normalizeCategory(data)
}

export async function update(id, category) {
  if (import.meta.env.VITE_DEMO_MODE === 'true') {
    const items = readLS(); const idx = items.findIndex(x=>x.id===id); if (idx>=0) { items[idx] = { ...items[idx], ...category }; writeLS(items); return items[idx] } return null
  }
  const payload = { nombre: category.name ?? category.nombre, tipo: category.type ? (category.type==='income'?'ing':'eg') : category.tipo }
  const { data } = await api.put(`/categorias/${id}/`, payload)
  return normalizeCategory(data)
}

export default { list, create, remove, getById, update }
