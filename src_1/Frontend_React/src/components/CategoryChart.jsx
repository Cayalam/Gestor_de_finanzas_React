import { useMemo } from 'react'
import { Bar, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  ArcElement,
  PieController,
  Tooltip,
  Legend
} from 'chart.js'
import { formatCurrency } from '../utils/currency'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  ArcElement,
  PieController,
  Tooltip,
  Legend
)

export default function CategoryChart({ data = [], type = 'income' }) {
  // Generar colores dinámicos para las categorías
  const generateColors = (count) => {
    const colors = [
      'rgba(34, 197, 94, 0.8)',   // Verde
      'rgba(59, 130, 246, 0.8)',   // Azul
      'rgba(168, 85, 247, 0.8)',   // Púrpura
      'rgba(236, 72, 153, 0.8)',   // Rosa
      'rgba(251, 146, 60, 0.8)',   // Naranja
      'rgba(234, 179, 8, 0.8)',    // Amarillo
      'rgba(20, 184, 166, 0.8)',   // Turquesa
      'rgba(239, 68, 68, 0.8)',    // Rojo
      'rgba(99, 102, 241, 0.8)',   // Índigo
      'rgba(132, 204, 22, 0.8)',   // Lima
    ]
    
    // Si necesitamos más colores, generamos aleatoriamente
    while (colors.length < count) {
      const r = Math.floor(Math.random() * 200 + 55)
      const g = Math.floor(Math.random() * 200 + 55)
      const b = Math.floor(Math.random() * 200 + 55)
      colors.push(`rgba(${r}, ${g}, ${b}, 0.8)`)
    }
    
    return colors.slice(0, count)
  }

  const incomeData = useMemo(() => {
    // Filtrar solo categorías con ingresos
    const filteredData = data.filter(d => d.income > 0)
    const labels = filteredData.map(d => d.category)
    const values = filteredData.map(d => d.income)
    const colors = generateColors(filteredData.length)

    return {
      labels,
      datasets: [{
        label: 'Ingresos por Categoría',
        data: values,
        backgroundColor: colors,
        borderColor: colors.map(c => c.replace('0.8', '1')),
        borderWidth: 2,
        borderRadius: 6,
      }]
    }
  }, [data])

  const expenseData = useMemo(() => {
    // Filtrar solo categorías con egresos
    const filteredData = data.filter(d => d.expense > 0)
    const labels = filteredData.map(d => d.category)
    const values = filteredData.map(d => d.expense)
    const colors = generateColors(filteredData.length)

    return {
      labels,
      datasets: [{
        label: 'Gastos por Categoría',
        data: values,
        backgroundColor: colors,
        borderColor: colors.map(c => c.replace('0.8', '1')),
        borderWidth: 2,
        borderRadius: 6,
      }]
    }
  }, [data])

  const combinedData = useMemo(() => {
    const labels = data.map(d => d.category)
    const incomes = data.map(d => d.income)
    const expenses = data.map(d => d.expense)

    return {
      labels,
      datasets: [
        {
          label: 'Ingresos',
          data: incomes,
          backgroundColor: 'rgba(34, 197, 94, 0.7)',
          borderColor: 'rgba(34, 197, 94, 1)',
          borderWidth: 2,
          borderRadius: 6,
        },
        {
          label: 'Gastos',
          data: expenses,
          backgroundColor: 'rgba(239, 68, 68, 0.7)',
          borderColor: 'rgba(239, 68, 68, 1)',
          borderWidth: 2,
          borderRadius: 6,
        }
      ]
    }
  }, [data])

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { 
        position: 'top',
        labels: {
          font: { size: 12, weight: 'bold' },
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        callbacks: {
          label: (ctx) => {
            const value = ctx.parsed.y
            return `${ctx.dataset.label}: ${formatCurrency(Number(value))}`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { 
          display: true, 
          text: 'Monto ($)',
          font: { size: 13, weight: 'bold' }
        },
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        ticks: {
          callback: function(value) {
            return formatCurrency(value)
          },
          font: { size: 11 }
        }
      },
      x: {
        ticks: { 
          maxRotation: 45,
          minRotation: 45,
          font: { size: 11 }
        },
        grid: { display: false }
      }
    }
  }

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'right',
        labels: {
          font: { size: 11 },
          padding: 10,
          boxWidth: 15
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        callbacks: {
          label: (ctx) => {
            const value = ctx.parsed
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0)
            const percentage = ((value / total) * 100).toFixed(1)
            return `${ctx.label}: ${formatCurrency(Number(value))} (${percentage}%)`
          }
        }
      }
    }
  }

  if (!data.length || (type === 'income' && !data.some(d => d.income > 0)) || 
      (type === 'expense' && !data.some(d => d.expense > 0))) {
    return (
      <div className="text-center py-12 text-gray-500">
        <span className="text-5xl mb-3 block">📊</span>
        <p>No hay datos de {type === 'income' ? 'ingresos' : 'gastos'} por categoría</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Gráficas de Pie separadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart de Ingresos */}
        {data.some(d => d.income > 0) && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>📈</span>
              <span>Distribución de Ingresos</span>
            </h4>
            <div className="h-80">
              <Pie data={incomeData} options={pieOptions} />
            </div>
          </div>
        )}

        {/* Pie Chart de Gastos */}
        {data.some(d => d.expense > 0) && (
          <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border border-red-100">
            <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>📉</span>
              <span>Distribución de Gastos</span>
            </h4>
            <div className="h-80">
              <Pie data={expenseData} options={pieOptions} />
            </div>
          </div>
        )}
      </div>

      {/* Tabla resumen */}
      <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
        <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>📋</span>
          <span>Resumen por Categoría</span>
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3 px-4 font-bold text-gray-700">Categoría</th>
                <th className="text-right py-3 px-4 font-bold text-green-700">Ingresos</th>
                <th className="text-right py-3 px-4 font-bold text-red-700">Gastos</th>
                <th className="text-right py-3 px-4 font-bold text-blue-700">Neto</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-white transition-colors">
                  <td className="py-3 px-4 font-semibold text-gray-800">{item.category}</td>
                  <td className="py-3 px-4 text-right text-green-600 font-medium">
                    {item.income > 0 ? formatCurrency(item.income) : '-'}
                  </td>
                  <td className="py-3 px-4 text-right text-red-600 font-medium">
                    {item.expense > 0 ? formatCurrency(item.expense) : '-'}
                  </td>
                  <td className={`py-3 px-4 text-right font-bold ${item.net >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                    {formatCurrency(item.net)}
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-gray-300 bg-gray-100 font-bold">
                <td className="py-3 px-4 text-gray-800">TOTAL</td>
                <td className="py-3 px-4 text-right text-green-700">
                  {formatCurrency(data.reduce((sum, item) => sum + item.income, 0))}
                </td>
                <td className="py-3 px-4 text-right text-red-700">
                  {formatCurrency(data.reduce((sum, item) => sum + item.expense, 0))}
                </td>
                <td className="py-3 px-4 text-right text-blue-700">
                  {formatCurrency(data.reduce((sum, item) => sum + item.net, 0))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
