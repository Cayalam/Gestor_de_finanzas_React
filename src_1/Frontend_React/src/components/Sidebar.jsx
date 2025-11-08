import { NavLink } from 'react-router-dom'
import { useGroup } from '../context/GroupContext'

const linkBase = 'flex items-center gap-3 px-3 py-2 rounded-md hover:bg-blue-50'
const linkActive = 'text-blue-700 font-medium bg-blue-50'
const linkInactive = 'text-gray-700'

function Item({ to, label, icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
      end={to === '/dashboard'}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm">{label}</span>
    </NavLink>
  )
}

export default function Sidebar() {
  const { activeGroup, groups, selectPersonal, selectGroup, getActiveGroupInfo, loading } = useGroup()

  console.log('📊 Sidebar: activeGroup =', activeGroup, 'groups =', groups, 'loading =', loading)

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
    <aside className="hidden md:flex md:flex-col w-64 border-r bg-white px-4 py-6">
      <div className="text-2xl font-semibold mb-6">FinanzApp</div>
      
      {/* Selector de contexto */}
      <div className="mb-6">
        <label className="block text-xs font-medium text-gray-600 mb-2">
          Contexto Activo
        </label>
        <select
          value={activeGroup || 'personal'}
          onChange={handleContextChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          <option value="personal">🏠 Personal</option>
          {groups.length > 0 && <option disabled>──────────</option>}
          {groups.map((group) => (
            <option key={group.id || group.grupo_id} value={group.id || group.grupo_id}>
              👥 {group.nombre || group.name}
            </option>
          ))}
        </select>
        
        {/* Indicador visual del contexto activo */}
        {activeGroupInfo && (
          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
            <div className="font-medium text-blue-900">Grupo: {activeGroupInfo.nombre || activeGroupInfo.name}</div>
            {activeGroupInfo.descripcion && (
              <div className="text-blue-700 mt-1">{activeGroupInfo.descripcion}</div>
            )}
          </div>
        )}
        {!activeGroup && (
          <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600">
            Vista personal
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-2">
        <Item to="/dashboard" label="Dashboard" icon="📊" />
        <Item to="/transactions" label="Transacciones" icon="🔁" />
        <Item to="/categories" label="Categorías" icon="🏷️" />
        <Item to="/pockets" label="Bolsillos" icon="💼" />
        <Item to="/groups" label="Grupos" icon="👥" />
      </nav>
      <div className="text-xs text-gray-500 mt-6">Versión 1.0.0</div>
    </aside>
  )
}
