import api from './api'

const demoData = { overview: { stats: [], pockets: [], categories: [] }, recent: [] }

const POCKETS_KEY = 'demo_pockets'
const TX_KEY = 'demo_transactions'

function readLS(key) {
  try { return JSON.parse(localStorage.getItem(key) || '[]') } catch { return [] }
}

function euro(n) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n)
}

export async function getOverview() {
  if (import.meta.env.VITE_DEMO_MODE === 'true') {
    const pockets = readLS(POCKETS_KEY)
    const txs = readLS(TX_KEY)
    if (import.meta.env.VITE_DEMO_EMPTY === 'true') return { stats: defaultStats(), pockets: [], categories: [] }

    const incomes = txs.filter(t => t.type === 'income').reduce((a, b) => a + Number(b.amount), 0)
    const expenses = txs.filter(t => t.type === 'expense').reduce((a, b) => a + Number(b.amount), 0)
    const net = incomes - expenses
    const totalBalance = pockets.reduce((sum, p) => sum + Number(p.balance || 0), 0)

    const stats = [
      { title: 'Balance Total', value: euro(totalBalance), icon: '👛' },
      { title: 'Ingresos', value: euro(incomes), icon: '📈' },
      { title: 'Gastos', value: euro(expenses), icon: '📉' },
      { title: 'Balance Neto', value: euro(net), icon: '🎯' },
    ]

    const pocketCards = pockets.map(p => ({ name: p.name, amount: euro(p.balance || 0), color: p.color || colorForPocket(p.id) }))

    // categorías: suma por categoría sobre gastos
    const catMap = {}
    txs.filter(t => t.type === 'expense').forEach(t => { const k=t.category||'Otros'; catMap[k]=(catMap[k]||0)+Number(t.amount) })
    const categories = Object.entries(catMap).map(([name, val]) => ({ name, amount: euro(val), percent: 100 }))

    return { stats, pockets: pocketCards, categories }
  }
  // Backend no tiene endpoint /dashboard; calculamos con datos crudos
  const [pocketsRes, ingresosRes, egresosRes] = await Promise.all([
  api.get('/bolsillos/'),
  api.get('/ingresos/'),
  api.get('/egresos/'),
  ])
  const pockets = (pocketsRes?.data || pocketsRes).map(p => ({
    name: p.nombre ?? p.name,
    amount: euro(Number(p.balance ?? p.saldo ?? 0)),
    color: p.color || '#3b82f6',
  }))
  const ingresos = (ingresosRes?.data || ingresosRes).reduce((a, b) => a + Number(b.monto ?? b.amount ?? 0), 0)
  const egresos = (egresosRes?.data || egresosRes).reduce((a, b) => a + Number(b.monto ?? b.amount ?? 0), 0)
  const neto = ingresos - egresos
  const totalBalance = (pocketsRes?.data || pocketsRes).reduce((s, p) => s + Number(p.balance ?? p.saldo ?? 0), 0)
  const stats = [
    { title: 'Balance Total', value: euro(totalBalance), icon: '👛' },
    { title: 'Ingresos', value: euro(ingresos), icon: '📈' },
    { title: 'Gastos', value: euro(egresos), icon: '📉' },
    { title: 'Balance Neto', value: euro(neto), icon: '🎯' },
  ]

  // categorías de egresos
  const catMap = {}
  ;(egresosRes?.data || egresosRes).forEach(t => {
    const k = t.categoria?.nombre ?? t.categoria ?? t.category ?? 'Otros'
    catMap[k] = (catMap[k] || 0) + Number(t.monto ?? t.amount ?? 0)
  })
  const totalCat = Object.values(catMap).reduce((a,b)=>a+b,0) || 1
  const categories = Object.entries(catMap).map(([name, val]) => ({ name, amount: euro(val), percent: Math.round((val/totalCat)*100) }))
  return { stats, pockets, categories }
}

export async function getRecentTransactions() {
  if (import.meta.env.VITE_DEMO_MODE === 'true') {
    if (import.meta.env.VITE_DEMO_EMPTY === 'true') return []
    const txs = readLS(TX_KEY)
    const pockets = readLS(POCKETS_KEY)
    const pocketName = (id) => pockets.find(p => p.id === id)?.name || (id || 'Sin bolsillo')
    return txs.slice(0, 5).map(t => ({
      title: t.description || (t.type==='income' ? 'Ingreso' : 'Gasto'),
      subtitle: `${t.category || 'Sin categoría'} • ${pocketName(t.pocket)}`,
      amount: `${t.type==='income' ? '+' : '-'}${euro(Number(t.amount))}`,
      date: new Date(t.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
      positive: t.type === 'income',
    }))
  }
  const [ing, egr, pocketsRes] = await Promise.all([
  api.get('/ingresos/'),
  api.get('/egresos/'),
  api.get('/bolsillos/'),
  ])
  const pockets = pocketsRes?.data || pocketsRes
  const pname = (id) => pockets.find(p => (p.id === id))?.nombre ?? pockets.find(p => (p.id === id))?.name ?? id
  const normalize = (arr, type) => (arr?.data || arr).map(t => ({
    title: t.descripcion || (type==='income' ? 'Ingreso' : 'Gasto'),
    subtitle: `${t.categoria?.nombre ?? 'Sin categoría'} • ${pname(t.bolsilloId ?? t.bolsillo ?? t.pocket)}`,
    amount: `${type==='income' ? '+' : '-'}${euro(Number(t.monto ?? t.amount))}`,
    date: new Date(t.fecha ?? t.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
    positive: type==='income',
  }))
  const items = [...normalize(ing, 'income'), ...normalize(egr, 'expense')].sort((a,b)=> new Date(b.date) - new Date(a.date))
  return items.slice(0,5)
}

function defaultStats() {
  return [
    { title: 'Balance Total', value: euro(0), icon: '👛' },
    { title: 'Ingresos', value: euro(0), icon: '📈' },
    { title: 'Gastos', value: euro(0), icon: '📉' },
    { title: 'Balance Neto', value: euro(0), icon: '🎯' },
  ]
}

function colorForPocket(id) {
  if (id === 'principal') return 'bg-blue-500'
  if (id === 'ahorros') return 'bg-green-500'
  if (id === 'efectivo') return 'bg-amber-500'
  return 'bg-gray-400'
}

export default { getOverview, getRecentTransactions }
