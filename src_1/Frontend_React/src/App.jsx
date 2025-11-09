import { Link, Route, Routes, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import { useAuth } from './context/AuthContext.jsx'
import { GroupProvider } from './context/GroupContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Sidebar from './components/Sidebar.jsx'
import Transactions from './pages/Transactions.jsx'
import Categories from './pages/Categories.jsx'
import Pockets from './pages/Pockets.jsx'
import Groups from './pages/Groups.jsx'
import './App.css'

function Layout({ children }) {
  const { isAuthenticated, logout } = useAuth()
  
  if (!isAuthenticated) {
    // Layout para páginas públicas (Login/Register)
    return <div className="min-h-screen">{children}</div>
  }

  // Layout para usuarios autenticados
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header moderno */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="mx-auto w-full px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-xl">💰</span>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                FinanzApp
              </h1>
              <p className="text-xs text-gray-500">Gestor inteligente</p>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <span>Salir</span>
            <span>🚪</span>
          </button>
        </div>
      </header>

      {/* Contenido principal con sidebar */}
      <div className="mx-auto w-full max-w-7xl px-4 md:px-6 py-6 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
        <Sidebar />
        <main className="w-full min-h-[calc(100vh-120px)]">{children}</main>
      </div>
    </div>
  )
}

function Placeholder({ title, children }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {children}
    </div>
  )
}

function App() {
  return (
    <GroupProvider>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Placeholder title="Bienvenido">
                <p>Usa el menú para iniciar sesión o registrarte.</p>
              </Placeholder>
            </Layout>
          }
        />
        <Route
          path="/login"
          element={<Layout><Login /></Layout>}
        />
        <Route
          path="/register"
          element={<Layout><Register /></Layout>}
        />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/transactions" element={<Layout><Transactions /></Layout>} />
          <Route path="/categories" element={<Layout><Categories /></Layout>} />
          <Route path="/pockets" element={<Layout><Pockets /></Layout>} />
          <Route path="/groups" element={<Layout><Groups /></Layout>} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </GroupProvider>
  )
}

export default App
