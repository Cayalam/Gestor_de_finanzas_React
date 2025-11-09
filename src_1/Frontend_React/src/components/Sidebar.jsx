import { NavLink } from 'react-router-dom'
import { useGroup } from '../context/GroupContext'

const linkBase = 'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group'
const linkActive = 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg scale-105'
const linkInactive = 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 hover:scale-105'

function Item({ to, label, icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
      end={to === '/dashboard'}
    >
      <span className="text-2xl transform group-hover:scale-110 transition-transform">{icon}</span>
      <span className="font-semibold">{label}</span>
    </NavLink>
  )
}

export default function Sidebar() {
  const { activeGroup, groups, selectPersonal, selectGroup, getActiveGroupInfo, loading } = useGroup()

  const handleContextChange = (e) => {
    const value = e.target.value
    if (value === 'personal') {
      selectPersonal()
    } else {
      selectGroup(parseInt(value))
    }
  }

  const activeGroupInfo = getActiveGroupInfo()

  return (
    <aside className="hidden md:flex md:flex-col bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-fit sticky top-24">
      {/* Selector de contexto */}
      <div className="mb-8">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          📍 Contexto
        </label>
        {loading ? (
          <div className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm text-gray-500 bg-gray-50 flex items-center gap-2">
            <div className="spinner border-indigo-500"></div>
            <span>Cargando...</span>
          </div>
        ) : (
          <select
            value={activeGroup || 'personal'}
            onChange={handleContextChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white hover:border-indigo-300 cursor-pointer"
          >
            <option value="personal">🏠 Personal</option>
            {groups.length > 0 && <option disabled>──────────</option>}
            {groups.map((group) => (
              <option key={group.id || group.grupo_id} value={group.id || group.grupo_id}>
                👥 {group.nombre || group.name}
              </option>
            ))}
          </select>
        )}
        
        {/* Indicador visual del contexto activo */}
        {activeGroupInfo && (
          <div className="mt-3 p-3 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-indigo-600">👥</span>
              <div className="font-bold text-indigo-900 text-sm">{activeGroupInfo.nombre || activeGroupInfo.name}</div>
            </div>
            {activeGroupInfo.descripcion && (
              <div className="text-xs text-indigo-700 mt-1">{activeGroupInfo.descripcion}</div>
            )}
          </div>
        )}
        {!activeGroup && (
          <div className="mt-3 p-3 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl">
            <div className="flex items-center gap-2">
              <span>🏠</span>
              <span className="text-xs font-semibold text-gray-600">Vista personal</span>
            </div>
          </div>
        )}
      </div>

      {/* Navegación */}
      <nav className="flex-1 space-y-2">
        <Item to="/dashboard" label="Dashboard" icon="📊" />
        <Item to="/transactions" label="Transacciones" icon="🔁" />
        <Item to="/categories" label="Categorías" icon="🏷️" />
        <Item to="/pockets" label="Bolsillos" icon="💼" />
        <Item to="/groups" label="Grupos" icon="👥" />
      </nav>

      {/* Footer del sidebar */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
            <span>✨</span>
          </div>
          <div>
            <div className="font-semibold text-gray-700">Versión 2.0</div>
            <div>Diseño mejorado</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
