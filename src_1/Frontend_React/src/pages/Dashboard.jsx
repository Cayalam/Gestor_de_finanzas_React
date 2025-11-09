import { useEffect, useState } from 'react'
import { useGroup } from '../context/GroupContext'
import * as dashboardService from '../services/dashboard'
import * as statsService from '../services/stats'
import MonthlyComparisonChart from '../components/MonthlyComparisonChart'

function StatCard({ title, value, icon, trend }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-between hover:shadow-xl transition-all duration-300 hover:scale-105 group">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500 mb-2">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {trend && (
          <p className={`text-xs mt-2 font-semibold flex items-center gap-1 ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
            <span>{trend.positive ? '📈' : '📉'}</span>
            {trend.text}
          </p>
        )}
      </div>
  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white grid place-items-center text-3xl shadow-lg group-hover:scale-110 transition-transform">
        {icon}
      </div>
    </div>
  )
}

function PocketItem({ name, amount, color }) {
  return (
    <div className="flex items-center justify-between bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-100 p-4 hover:shadow-md transition-all duration-200 hover:scale-102">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl grid place-items-center text-white shadow-lg text-xl" style={{ background: color }}>
          💼
        </div>
        <span className="text-sm font-semibold text-gray-700">{name}</span>
      </div>
      <span className="font-bold text-lg text-gray-900">{amount}</span>
    </div>
  )
}

function CategoryBar({ name, amount, percent }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">{name}</span>
        <span className="text-sm font-bold text-gray-900">{amount}</span>
      </div>
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full transition-all duration-500" 
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

function TxRow({ title, subtitle, amount, date, positive }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 px-3 rounded-lg transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${positive ? 'bg-green-100' : 'bg-red-100'}`}>
          <span className="text-lg">{positive ? '📈' : '📉'}</span>
        </div>
        <div>
          <p className="font-semibold text-gray-900">{title}</p>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`font-bold text-lg ${positive ? 'text-green-600' : 'text-red-600'}`}>
          {amount}
        </p>
        <p className="text-xs text-gray-500">{date}</p>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { activeGroup, getActiveGroupInfo } = useGroup()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [monthly, setMonthly] = useState([])
  const [monthsBack, setMonthsBack] = useState(6)

  async function load() {
    try {
      const overview = await dashboardService.getOverview(activeGroup)
      const recent = await dashboardService.getRecentTransactions(activeGroup)
  const monthlyData = await statsService.getMonthlyIncomeExpense(activeGroup, monthsBack)
      setData({ ...overview, transactions: recent })
      setMonthly(monthlyData)
    } catch {
      setData({ stats: [], pockets: [], categories: [], transactions: [] })
      setMonthly([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    const onStorage = (e) => {
      if (e.key === 'demo_transactions' || e.key === 'demo_pockets') {
        load()
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [activeGroup, monthsBack]) // Recargar cuando cambie el grupo activo o el rango

  const activeGroupInfo = getActiveGroupInfo()
  const contextTitle = activeGroup ? `Dashboard - ${activeGroupInfo?.nombre || 'Grupo'}` : 'Dashboard Financiero'
  const contextSubtitle = activeGroup ? 'Resumen del grupo' : 'Resumen personal de este mes'

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="spinner border-indigo-500 w-12 h-12 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
  <div className="space-y-12 sm:space-y-16 xl:space-y-20 fade-in max-w-[1900px] mx-auto px-3 sm:px-4 lg:px-8 xl:px-12 2xl:px-16 py-6 sm:py-8">
      {/* Header */}
  <div className="bg-gradient-to-r from-emerald-500 via-green-600 to-lime-500 rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 text-white shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">{contextTitle}</h2>
            <p className="text-indigo-100 text-lg">{contextSubtitle}</p>
          </div>
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm">
            <span className="text-xl">📅</span>
            <span className="font-semibold">Noviembre 2025</span>
          </div>
        </div>
      </div>

      {/* Divisor visual entre estadísticas y secciones detalladas */}
  <div className="relative flex items-center justify-center mt-10 sm:mt-12 pb-8 sm:pb-10">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent"></div>
        <div className="absolute px-4 py-1.5 sm:px-6 sm:py-2 rounded-full bg-white shadow-lg border border-emerald-200 flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-700">
          <span>{activeGroup ? '�' : '🧍'}</span>
          <span>{activeGroup ? 'Detalle del Grupo' : 'Detalle Personal'}</span>
        </div>
      </div>

  {/* Stats Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 xl:gap-12 2xl:gap-14">
        {(data.stats && data.stats.length ? data.stats : [
          { title: 'Balance Total', value: '0,00 €', icon: '👛' },
          { title: 'Ingresos', value: '0,00 €', icon: '📈' },
          { title: 'Gastos', value: '0,00 €', icon: '📉' },
          { title: 'Balance Neto', value: '0,00 €', icon: '🎯' },
        ]).map((s, i) => (
          <div key={i} className="slide-in" style={{ animationDelay: `${i * 0.1}s` }}>
            <StatCard title={s.title} value={s.value} icon={s.icon} trend={s.trend} />
          </div>
        ))}
      </div>

      {/* Pockets y Categories */}
  <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-5 gap-10 xl:gap-12 2xl:gap-14">
        {/* Bolsillos */}
  <div className="lg:col-span-2 xl:col-span-3 bg-white rounded-3xl border border-gray-100 p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <span className="text-xl">💼</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Bolsillos</h3>
          </div>
          {data.pockets?.length ? (
            <div className="space-y-5">
              {data.pockets.map((p, i) => (
                <PocketItem key={i} name={p.name} amount={p.amount} color={p.color} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <span className="text-4xl mb-2 block">💼</span>
              <p>Aún no tienes bolsillos creados</p>
            </div>
          )}
        </div>

        {/* Categorías */}
  <div className="xl:col-span-2 bg-white rounded-3xl border border-gray-100 p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
              <span className="text-xl">🏷️</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Gastos</h3>
          </div>
          {data.categories?.length ? (
            <div className="space-y-5">
              {data.categories.map((c, i) => (
                <CategoryBar key={i} name={c.name} amount={c.amount} percent={c.percent} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <span className="text-4xl mb-2 block">🏷️</span>
              <p className="text-sm">Sin gastos categorizados</p>
            </div>
          )}
        </div>
      </div>

      {/* Comparativa Mensual */}
  <div className="bg-white rounded-3xl border border-gray-100 p-10 xl:p-12 shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-xl">📊</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Comparativa Mensual</h3>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="monthsBack" className="text-sm font-medium text-gray-600">Rango:</label>
            <select
              id="monthsBack"
              value={monthsBack}
              onChange={e => setMonthsBack(Number(e.target.value))}
              className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value={3}>3 meses</option>
              <option value={6}>6 meses</option>
              <option value={12}>12 meses</option>
            </select>
          </div>
        </div>
        {monthly.length ? (
          <MonthlyComparisonChart data={monthly} months={monthsBack} />
        ) : (
          <div className="text-center py-12 text-gray-500">
            <span className="text-5xl mb-3 block">📊</span>
            <p>No hay datos suficientes para mostrar la comparativa</p>
          </div>
        )}
      </div>

      {/* Transacciones Recientes */}
  <div className="bg-white rounded-3xl border border-gray-100 p-10 xl:p-12 shadow-xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
            <span className="text-xl">🔁</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900">Transacciones Recientes</h3>
        </div>
        {data.transactions?.length ? (
          <div className="space-y-2">
            {data.transactions.map((t, i) => (
              <TxRow key={i} title={t.title} subtitle={t.subtitle} amount={t.amount} date={t.date} positive={t.positive} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <span className="text-5xl mb-3 block">🔁</span>
            <p>Aún no hay transacciones recientes</p>
          </div>
        )}
      </div>
    </div>
  )
}
