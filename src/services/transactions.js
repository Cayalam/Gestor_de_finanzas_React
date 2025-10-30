import api from './api'
const LS_KEY = 'demo_transactions'
const POCKETS_KEY = 'demo_pockets'

function readLS() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]') } catch { return [] }
}
function writeLS(items) {
  localStorage.setItem(LS_KEY, JSON.stringify(items))
}

function readPockets() {
  try { return JSON.parse(localStorage.getItem(POCKETS_KEY) || '[]') } catch { return [] }
}
function writePockets(items) {
  localStorage.setItem(POCKETS_KEY, JSON.stringify(items))
}
function pocketLabel(id) {
  const map = { principal: 'Cuenta Principal', ahorros: 'Ahorros', efectivo: 'Efectivo' }
  return map[id] || id || 'Sin bolsillo'
}

export async function list() {
  if (import.meta.env.VITE_DEMO_MODE === 'true') return readLS()
  // Combinar ingresos y egresos en una sola lista normalizada
  const [ing, egr] = await Promise.all([
    api.get('/ingresos'),
    api.get('/egresos'),
  ])
  const normalize = (arr, type) => (arr?.data || arr).map(x => ({
    id: x.id,
    type,
    amount: Number(x.monto ?? x.amount),
    date: x.fecha ?? x.date,
    category: x.categoria?.nombre ?? x.categoria?.name ?? x.category,
    pocket: x.bolsillo?.nombre ?? x.bolsillo?.name ?? x.pocket,
    description: x.descripcion ?? x.description ?? '',
  }))
  const items = [...normalize(ing, 'income'), ...normalize(egr, 'expense')]
  return items.sort((a,b)=> new Date(b.date) - new Date(a.date))
}

export async function create(tx) {
  if (import.meta.env.VITE_DEMO_MODE === 'true') {
    const items = readLS()
    const withId = { ...tx, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
    items.unshift(withId)
    writeLS(items)
    // actualizar bolsillos
    if (withId.pocket) {
      const pockets = readPockets()
      const idx = pockets.findIndex(p => p.id === withId.pocket)
      const delta = Number(withId.amount) * (withId.type === 'income' ? 1 : -1)
      if (idx >= 0) {
        pockets[idx] = { ...pockets[idx], balance: Number((pockets[idx].balance || 0)) + delta }
      } else {
        pockets.push({ id: withId.pocket, name: pocketLabel(withId.pocket), balance: delta })
      }
      writePockets(pockets)
    }
    return withId
  }
  // En backend crear según tipo
  if (tx.type === 'income') {
    const { data } = await api.post('/ingresos', {
      monto: tx.amount,
      fecha: tx.date,
      categoriaId: tx.categoryId ?? tx.category,
      bolsilloId: tx.pocketId ?? tx.pocket,
      descripcion: tx.description,
    })
    return {
      id: data.id,
      type: 'income',
      amount: Number(data.monto ?? tx.amount),
      date: data.fecha ?? tx.date,
      category: data.categoria?.nombre ?? tx.category,
      pocket: data.bolsillo?.nombre ?? tx.pocket,
      description: data.descripcion ?? tx.description,
    }
  } else {
    const { data } = await api.post('/egresos', {
      monto: tx.amount,
      fecha: tx.date,
      categoriaId: tx.categoryId ?? tx.category,
      bolsilloId: tx.pocketId ?? tx.pocket,
      descripcion: tx.description,
    })
    return {
      id: data.id,
      type: 'expense',
      amount: Number(data.monto ?? tx.amount),
      date: data.fecha ?? tx.date,
      category: data.categoria?.nombre ?? tx.category,
      pocket: data.bolsillo?.nombre ?? tx.pocket,
      description: data.descripcion ?? tx.description,
    }
  }
}

export async function remove(id, type) {
  if (import.meta.env.VITE_DEMO_MODE === 'true') {
    const items = readLS()
    const tx = items.find(x => x.id === id)
    const rest = items.filter(x => x.id !== id)
    writeLS(rest)
    if (tx && tx.pocket) {
      const pockets = readPockets()
      const idx = pockets.findIndex(p => p.id === tx.pocket)
      const delta = Number(tx.amount) * (tx.type === 'income' ? -1 : 1) // revertir efecto
      if (idx >= 0) {
        pockets[idx] = { ...pockets[idx], balance: Number((pockets[idx].balance || 0)) + delta }
        writePockets(pockets)
      }
    }
    return { ok: true }
  }
  if (type === 'income') {
    const { data } = await api.delete(`/ingresos/${id}`)
    return data
  } else {
    const { data } = await api.delete(`/egresos/${id}`)
    return data
  }
}

export default { list, create, remove }
