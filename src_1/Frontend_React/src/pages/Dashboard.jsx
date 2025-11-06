import { useEffect, useState } from 'react'
import * as dashboardService from '../services/dashboard'

function StatCard({ title, value, icon, trend }) {
  return (
    <div className="bg-white rounded-xl border p-5 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold mt-1">{value}</p>
        {trend && <p className={`text-xs mt-1 ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>{trend.text}</p>}
      </div>
      <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 grid place-items-center text-xl">{icon}</div>
    </div>
  )
}

function PocketItem({ name, amount, color }) {
  return (
    <div className="flex items-center justify-between bg-white rounded-lg border p-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg grid place-items-center text-white" style={{ background: color }}>💼</div>
        <span className="text-sm font-medium">{name}</span>
      </div>
      <span className="font-semibold">{amount}</span>
    </div>
  )
}

function CategoryBar({ name, amount, percent }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm"><span>{name}</span><span className="text-gray-600">{amount}</span></div>
      <div className="w-full h-2 bg-red-100 rounded mt-1">
        <div className="h-2 bg-red-500 rounded" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

function TxRow({ title, subtitle, amount, date, positive }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>
      <div className="text-right">
        <p className={`${positive ? 'text-green-600' : 'text-red-600'} font-semibold`}>{amount}</p>
        <p className="text-xs text-gray-500">{date}</p>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)

  async function load() {
    try {
      const overview = await dashboardService.getOverview()
      const recent = await dashboardService.getRecentTransactions()
      setData({ ...overview, transactions: recent })
    } catch {
      setData({ stats: [], pockets: [], categories: [], transactions: [] })
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
  }, [])

  if (loading || !data) return <p className="text-gray-600 px-4">Cargando dashboard…</p>

  return (
    <div className="px-1 sm:px-2 lg:px-0 py-6 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Dashboard Financiero</h2>
          <p className="text-sm text-gray-600">Resumen de este mes</p>
        </div>
        <div className="text-sm text-gray-600">septiembre 2025</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
        {(data.stats && data.stats.length ? data.stats : [
          { title: 'Balance Total', value: '0,00 €', icon: '👛' },
          { title: 'Ingresos', value: '0,00 €', icon: '📈' },
          { title: 'Gastos', value: '0,00 €', icon: '📉' },
          { title: 'Balance Neto', value: '0,00 €', icon: '🎯' },
        ]).map((s, i) => (
          <div key={i} className="card p-4">
            <StatCard title={s.title} value={s.value} icon={s.icon} trend={s.trend} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 card p-5">
          <h3 className="font-semibold mb-4">Bolsillos</h3>
          {data.pockets?.length ? (
            <div className="space-y-3">
              {data.pockets.map((p, i) => (
                <PocketItem key={i} name={p.name} amount={p.amount} color={p.color} />
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500">Aún no tienes bolsillos creados.</div>
          )}
        </div>
        <div className="card p-5">
          <h3 className="font-semibold mb-4">Gastos por Categoría</h3>
          {data.categories?.length ? (
            <div className="space-y-4">
              {data.categories.map((c, i) => (
                <CategoryBar key={i} name={c.name} amount={c.amount} percent={c.percent} />
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500">No hay gastos categorizados por ahora.</div>
          )}
        </div>
      </div>

      <div className="card p-5 mt-6">
        <h3 className="font-semibold mb-4">Transacciones Recientes</h3>
        {data.transactions?.length ? (
          <div className="divide-y">
            {data.transactions.map((t, i) => (
              <TxRow key={i} title={t.title} subtitle={t.subtitle} amount={t.amount} date={t.date} positive={t.positive} />
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500">Aún no hay transacciones recientes.</div>
        )}
      </div>
    </div>
  )
}
