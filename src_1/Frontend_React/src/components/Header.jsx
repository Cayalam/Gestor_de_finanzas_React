import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useGroup } from '../context/GroupContext.jsx'

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { activeGroup } = useGroup()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
  <header className="sticky top-0 z-40 w-full backdrop-blur bg-white/80 border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
            <span className="text-2xl">💰</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-tight text-gray-800">FinanzApp</span>
            <span className="text-[10px] uppercase font-semibold text-emerald-600">Gestor inteligente</span>
          </div>
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            {activeGroup && (
              <div className="hidden md:flex px-3 py-1.5 text-xs rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium">
                Grupo activo: {activeGroup}
              </div>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
            >
              Salir
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-sm">
            {location.pathname !== '/login' && (
              <Link to="/login" className="text-emerald-600 hover:text-emerald-500 font-semibold">Ingresar</Link>
            )}
            {location.pathname !== '/register' && (
              <Link to="/register" className="px-3 py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 font-semibold">Registrarse</Link>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
