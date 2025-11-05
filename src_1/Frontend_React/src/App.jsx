import { Link, Route, Routes, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import { useAuth } from './context/AuthContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Sidebar from './components/Sidebar.jsx'
import Transactions from './pages/Transactions.jsx'
import Categories from './pages/Categories.jsx'
import Pockets from './pages/Pockets.jsx'
import Groups from './pages/Groups.jsx'
import './App.css'

function Layout({ children }) {
  const { isAuthenticated, logout } = useAuth()
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b w-full">
        <div className="mx-auto w-full max-w-7xl px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Gestor de Finanzas</h1>
          <nav className="flex gap-4">
            {!isAuthenticated && (
              <>
                <Link className="text-blue-600 hover:underline" to="/login">Login</Link>
                <Link className="text-blue-600 hover:underline" to="/register">Registro</Link>
              </>
            )}
            {isAuthenticated && (
              <button onClick={logout} className="text-red-600 hover:underline">Salir</button>
            )}
          </nav>
        </div>
      </header>
      {isAuthenticated ? (
        <div className="mx-auto w-full max-w-7xl px-0 md:px-6 py-6 md:py-8 grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-6">
          <Sidebar />
          <main className="w-full">{children}</main>
        </div>
      ) : (
        <main className="mx-auto max-w-md px-4 py-8">{children}</main>
      )}
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
  )
}

export default App
