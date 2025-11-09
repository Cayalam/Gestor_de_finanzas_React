import { createContext, useContext, useState, useEffect } from 'react'
import * as groupsService from '../services/groups'

const GroupContext = createContext()

export function GroupProvider({ children }) {
  // null = Personal, grupo_id = Grupo específico
  const [activeGroup, setActiveGroup] = useState(() => {
    const saved = localStorage.getItem('activeGroup')
    return saved ? parseInt(saved) : null
  })
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGroups()
  }, [])

  const loadGroups = async () => {
    try {
      console.log('🔍 GroupContext: Cargando grupos...')
      const data = await groupsService.list()
      console.log('✅ GroupContext: Grupos cargados:', data)
      setGroups(data)
    } catch (error) {
      console.error('❌ GroupContext: Error cargando grupos:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectGroup = (grupoId) => {
    setActiveGroup(grupoId)
    // Guardar en localStorage para persistencia
    if (grupoId) {
      localStorage.setItem('activeGroup', grupoId)
    } else {
      localStorage.removeItem('activeGroup')
    }
  }

  const selectPersonal = () => {
    selectGroup(null)
  }

  // Nota: activeGroup ya se inicializa desde localStorage en el primer render

  // Obtener información del grupo activo
  const getActiveGroupInfo = () => {
    if (!activeGroup) return null
    return groups.find(g => (g.id || g.grupo_id) === activeGroup)
  }

  const value = {
    activeGroup,        // null o grupo_id
    groups,             // Lista de todos los grupos
    loading,
    selectGroup,        // Función para seleccionar un grupo
    selectPersonal,     // Función para volver a Personal
    getActiveGroupInfo, // Obtener info del grupo activo
    loadGroups,         // Recargar lista de grupos
    isPersonal: activeGroup === null, // Helper booleano
  }

  return (
    <GroupContext.Provider value={value}>
      {children}
    </GroupContext.Provider>
  )
}

export function useGroup() {
  const context = useContext(GroupContext)
  if (!context) {
    throw new Error('useGroup debe usarse dentro de un GroupProvider')
  }
  return context
}
