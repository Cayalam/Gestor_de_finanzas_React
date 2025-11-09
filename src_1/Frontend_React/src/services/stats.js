import api from './api'

// Servicio de estadísticas:
// getMonthlyIncomeExpense(grupoId, monthsBack)
// Agrupa ingresos y egresos por mes (formato YYYY-MM) y devuelve hasta monthsBack meses
// con estructura: { month: 'YYYY-MM', income: number, expense: number, net: number }

// Agrega ingresos y egresos por mes (YYYY-MM) devolviendo últimos N meses ordenados asc.
export async function getMonthlyIncomeExpense(grupoId = null, monthsBack = 6) {
  const params = grupoId ? { grupo_id: grupoId } : {}
  const [ingRes, egrRes] = await Promise.all([
    api.get('/ingresos/', { params }),
    api.get('/egresos/', { params }),
  ])
  const ingresos = ingRes.data || []
  const egresos = egrRes.data || []

  const bucket = new Map() // key -> { income, expense }
  const takeMonth = (d) => {
    // fecha puede venir como 'YYYY-MM-DD'
    if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) return d.slice(0,7)
    const date = new Date(d)
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}`
  }

  ingresos.forEach(r => {
    const m = takeMonth(r.fecha || r.date)
    if (!bucket.has(m)) bucket.set(m, { month: m, income: 0, expense: 0 })
    bucket.get(m).income += Number(r.monto ?? r.amount ?? 0)
  })
  egresos.forEach(r => {
    const m = takeMonth(r.fecha || r.date)
    if (!bucket.has(m)) bucket.set(m, { month: m, income: 0, expense: 0 })
    bucket.get(m).expense += Number(r.monto ?? r.amount ?? 0)
  })

  // Ordenar meses y limitar
  const all = Array.from(bucket.values()).sort((a,b) => a.month.localeCompare(b.month))
  const last = all.slice(-monthsBack)
  // Formateo final (euros string + valores numéricos)
  return last.map(entry => ({
    month: entry.month,
    income: entry.income,
    expense: entry.expense,
    net: entry.income - entry.expense,
  }))
}

export default { getMonthlyIncomeExpense }