import { NavLink } from 'react-router-dom'

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
  return (
    <aside className="hidden md:flex md:flex-col w-64 border-r bg-white px-4 py-6">
  <div className="text-xl font-semibold mb-6">FinanzApp</div>
      <nav className="flex-1 space-y-1">
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
