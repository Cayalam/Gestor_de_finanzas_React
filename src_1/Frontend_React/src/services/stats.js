import api from './api'

// Servicio de estadísticas:
// getMonthlyIncomeExpense(grupoId, monthsBack, groupBy, referenceDate)
// Agrupa ingresos y egresos por mes o año según el parámetro groupBy
// con estructura: { month: 'YYYY-MM' | 'YYYY', income: number, expense: number, net: number }

// Agrega ingresos y egresos por mes (YYYY-MM) o año (YYYY) devolviendo últimos N periodos ordenados asc.
// referenceDate: fecha de referencia en formato 'YYYY-MM' desde donde contar hacia atrás
export async function getMonthlyIncomeExpense(grupoId = null, monthsBack = 6, groupBy = 'month', referenceDate = null) {
  const params = grupoId ? { grupo_id: grupoId } : {}
  const [ingRes, egrRes] = await Promise.all([
    api.get('/ingresos/', { params }),
    api.get('/egresos/', { params }),
  ])
  const ingresos = ingRes.data || []
  const egresos = egrRes.data || []

  const bucket = new Map() // key -> { income, expense }
  
  const takePeriod = (d) => {
    // fecha puede venir como 'YYYY-MM-DD'
    let dateStr
    if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) {
      dateStr = d
    } else {
      const date = new Date(d)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      dateStr = `${year}-${month}-01`
    }
    
    if (groupBy === 'year') {
      return dateStr.slice(0, 4) // Solo año: 'YYYY'
    } else {
      return dateStr.slice(0, 7) // Año-mes: 'YYYY-MM'
    }
  }

  ingresos.forEach(r => {
    const m = takePeriod(r.fecha || r.date)
    if (!bucket.has(m)) bucket.set(m, { month: m, income: 0, expense: 0 })
    bucket.get(m).income += Number(r.monto ?? r.amount ?? 0)
  })
  egresos.forEach(r => {
    const m = takePeriod(r.fecha || r.date)
    if (!bucket.has(m)) bucket.set(m, { month: m, income: 0, expense: 0 })
    bucket.get(m).expense += Number(r.monto ?? r.amount ?? 0)
  })

  // Ordenar periodos
  const all = Array.from(bucket.values()).sort((a,b) => a.month.localeCompare(b.month))
  
  // Si hay fecha de referencia, filtrar hasta esa fecha y tomar los últimos N
  let filtered = all
  if (referenceDate) {
    const refPeriod = groupBy === 'year' ? referenceDate.slice(0, 4) : referenceDate
    filtered = all.filter(entry => entry.month <= refPeriod)
  }
  
  const last = filtered.slice(-monthsBack)
  
  // Generar todos los periodos esperados (incluso si no tienen datos)
  const referenceStr = referenceDate || (() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })()
  
  const allPeriods = []
  if (groupBy === 'year') {
    // Generar años
    const endYear = parseInt(referenceStr.slice(0, 4))
    for (let i = monthsBack - 1; i >= 0; i--) {
      const year = endYear - i
      const existing = last.find(e => e.month === String(year))
      allPeriods.push(existing || { month: String(year), income: 0, expense: 0, net: 0 })
    }
  } else {
    // Generar meses
    const [endYear, endMonth] = referenceStr.split('-').map(Number)
    for (let i = monthsBack - 1; i >= 0; i--) {
      const targetDate = new Date(endYear, endMonth - 1 - i, 1)
      const year = targetDate.getFullYear()
      const month = String(targetDate.getMonth() + 1).padStart(2, '0')
      const periodKey = `${year}-${month}`
      const existing = last.find(e => e.month === periodKey)
      allPeriods.push(existing || { month: periodKey, income: 0, expense: 0, net: 0 })
    }
  }
  
  // Formateo final
  return allPeriods.map(entry => ({
    month: entry.month,
    income: entry.income,
    expense: entry.expense,
    net: entry.income - entry.expense,
  }))
}

// Obtiene estadísticas de ingresos y egresos agrupados por categoría
export async function getCategoryStats(grupoId = null, monthsBack = 6, referenceDate = null) {
  const params = grupoId ? { grupo_id: grupoId } : {}
  const [ingRes, egrRes] = await Promise.all([
    api.get('/ingresos/', { params }),
    api.get('/egresos/', { params }),
  ])
  const ingresos = ingRes.data || []
  const egresos = egrRes.data || []

  // Calcular fecha de corte si se especifica
  let cutoffDate = null
  if (monthsBack && referenceDate) {
    const [refYear, refMonth] = referenceDate.split('-').map(Number)
    cutoffDate = new Date(refYear, refMonth - monthsBack, 1)
  }

  // Filtrar por fecha si hay cutoff
  const filteredIngresos = cutoffDate 
    ? ingresos.filter(i => new Date(i.fecha || i.date) >= cutoffDate)
    : ingresos
  
  const filteredEgresos = cutoffDate
    ? egresos.filter(e => new Date(e.fecha || e.date) >= cutoffDate)
    : egresos

  // Agrupar ingresos por categoría
  const incomeByCategory = {}
  filteredIngresos.forEach(i => {
    const categoria = i.categoria?.nombre || i.categoria || i.category || 'Sin categoría'
    const monto = Number(i.monto ?? i.amount ?? 0)
    incomeByCategory[categoria] = (incomeByCategory[categoria] || 0) + monto
  })

  // Agrupar egresos por categoría
  const expenseByCategory = {}
  filteredEgresos.forEach(e => {
    const categoria = e.categoria?.nombre || e.categoria || e.category || 'Sin categoría'
    const monto = Number(e.monto ?? e.amount ?? 0)
    expenseByCategory[categoria] = (expenseByCategory[categoria] || 0) + monto
  })

  // Obtener todas las categorías únicas
  const allCategories = new Set([
    ...Object.keys(incomeByCategory),
    ...Object.keys(expenseByCategory)
  ])

  // Formatear datos para las gráficas
  const categoryData = Array.from(allCategories).map(categoria => ({
    category: categoria,
    income: incomeByCategory[categoria] || 0,
    expense: expenseByCategory[categoria] || 0,
    net: (incomeByCategory[categoria] || 0) - (expenseByCategory[categoria] || 0)
  }))

  // Ordenar por total (ingreso + egreso) descendente
  categoryData.sort((a, b) => (b.income + b.expense) - (a.income + a.expense))

  return categoryData
}

export default { getMonthlyIncomeExpense, getCategoryStats }