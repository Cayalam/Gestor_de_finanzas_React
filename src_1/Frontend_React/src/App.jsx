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
import Header from './components/Header.jsx'

function Layout({ children }) {
  const { isAuthenticated, logout } = useAuth()
  
  if (!isAuthenticated) {
    // Layout para páginas públicas (Login/Register)
    return <div className="min-h-screen">{children}</div>
  }

  // Layout para usuarios autenticados
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />
      <div className="grid grid-cols-[auto_1fr] w-full">
        <Sidebar />
        <main className="bg-gray-50 p-4 sm:p-6 lg:p-10">
          <div className="w-full max-w-[1920px] mx-auto">
            {children}
          </div>
        </main>
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

// Redirección inteligente para la ruta raíz
function HomeRedirect() {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }
  return <Navigate to="/login" replace />
}

function App() {
  return (
    <GroupProvider>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
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
