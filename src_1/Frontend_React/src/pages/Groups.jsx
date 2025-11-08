import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { jwtDecode } from 'jwt-decode'
import * as groupsService from '../services/groups'
import * as userGroupService from '../services/userGroup'
import * as usersService from '../services/users'

export default function Groups() {
  const { user } = useAuth()
  
  // Obtener usuario del token como fallback
  const getUserFromToken = () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        console.log('🎫 Token encontrado:', token.substring(0, 50) + '...')
        const decoded = jwtDecode(token)
        console.log('✅ Token decodificado exitosamente:', decoded)
        return decoded
      }
      console.log('⚠️ No hay token en localStorage')
    } catch (err) {
      console.error('❌ Error decodificando token:', err)
    }
    return null
  }
  
  // DEBUG: Verificar que tenemos el usuario
  useEffect(() => {
    console.log('🔐 Auth user en Groups:', user)
    const tokenUser = getUserFromToken()
    console.log('🎫 Usuario del token directo:', tokenUser)
  }, [user])
  
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ nombre: '', descripcion: '' })
  const [editingGroup, setEditingGroup] = useState(null)
  
  // Estado para roles del usuario en cada grupo
  const [userRoles, setUserRoles] = useState({}) // { grupoId: 'admin' | 'miembro' }
  
  // Estado para miembros al crear grupo
  const [newMembers, setNewMembers] = useState([])
  const [memberEmail, setMemberEmail] = useState('')
  const [memberRole, setMemberRole] = useState('miembro')
  const [createError, setCreateError] = useState('')
  
  // Estado para modal de miembros
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [members, setMembers] = useState([])
  const [loadingMembers, setLoadingMembers] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  
  // Estado para agregar usuario
  const [emailToAdd, setEmailToAdd] = useState('')
  const [roleToAdd, setRoleToAdd] = useState('miembro')
  const [addingUser, setAddingUser] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    (async () => {
      const data = await groupsService.list()
      setItems(data)
      
      // Cargar roles del usuario en cada grupo
      await loadUserRoles(data)
      
      setLoading(false)
    })()
  }, [])

  const loadUserRoles = async (groups) => {
    const currentUser = user || getUserFromToken()
    if (!currentUser) {
      try {
        const userData = await usersService.me()
        if (userData) {
          await loadUserRolesWithUser(groups, userData)
        }
      } catch (err) {
        console.error('Error obteniendo usuario para roles:', err)
      }
    } else {
      await loadUserRolesWithUser(groups, currentUser)
    }
  }

  const loadUserRolesWithUser = async (groups, currentUser) => {
    const roles = {}
    
    for (const group of groups) {
      try {
        const members = await userGroupService.listMembers(group.id || group.grupo_id)
        const membership = members.find(m => 
          m.usuario_id === currentUser?.usuario_id || 
          m.usuario_id === currentUser?.user_id ||
          m.email === currentUser?.email
        )
        
        if (membership) {
          roles[group.id || group.grupo_id] = membership.rol
        }
      } catch (err) {
        console.error(`Error cargando rol para grupo ${group.nombre}:`, err)
      }
    }
    
    setUserRoles(roles)
  }

  const canSave = useMemo(() => !!form.nombre, [form])

  const addMemberToList = async () => {
    if (!memberEmail.trim()) {
      setCreateError('Ingresa un email válido')
      return
    }
    
    // Verificar si ya está en la lista
    if (newMembers.some(m => m.email === memberEmail.trim())) {
      setCreateError('Este email ya está en la lista')
      return
    }
    
    // Validar que el usuario existe en la base de datos
    setCreateError('Verificando email...')
    try {
      const exists = await usersService.checkEmailExists(memberEmail.trim())
      if (!exists) {
        setCreateError(`El correo "${memberEmail.trim()}" no está registrado en el sistema`)
        return
      }
      
      setNewMembers([...newMembers, { email: memberEmail.trim(), rol: memberRole }])
      setMemberEmail('')
      setMemberRole('miembro')
      setCreateError('')
    } catch (err) {
      setCreateError('Error al verificar el email. Intenta nuevamente.')
    }
  }

  const removeMemberFromList = (email) => {
    setNewMembers(newMembers.filter(m => m.email !== email))
  }

  const save = async (e) => {
    e.preventDefault()
    if (!canSave) return
    
    setCreateError('')
    
    try {
      if (editingGroup) {
        // Actualizar grupo existente
        const updated = await groupsService.update(editingGroup.id || editingGroup.grupo_id, form)
        setItems(prev => prev.map(g => (g.id || g.grupo_id) === (editingGroup.id || editingGroup.grupo_id) ? updated : g))
        setOpen(false)
        setEditingGroup(null)
        setForm({ nombre: '', descripcion: '' })
      } else {
        // Crear el grupo
        const created = await groupsService.create(form)
        
        // Agregar miembros al grupo
        for (const member of newMembers) {
          try {
            await userGroupService.addByEmail({
              email: member.email,
              grupoId: created.id || created.grupo_id,
              rol: member.rol
            })
          } catch (err) {
            console.error(`Error al agregar ${member.email}:`, err)
            // Continuar con los demás miembros aunque falle uno
          }
        }
        
        setItems(prev => [created, ...prev])
        setOpen(false)
        setForm({ nombre: '', descripcion: '' })
        setNewMembers([])
        setMemberEmail('')
        setMemberRole('miembro')
      }
    } catch (err) {
      setCreateError(editingGroup ? 'Error al actualizar el grupo' : 'Error al crear el grupo')
    }
  }

  const openEditForm = (group) => {
    setEditingGroup(group)
    setForm({ nombre: group.nombre || group.name, descripcion: group.descripcion || '' })
    setOpen(true)
    setNewMembers([])
    setCreateError('')
  }

  const cancelEdit = () => {
    setOpen(false)
    setEditingGroup(null)
    setForm({ nombre: '', descripcion: '' })
    setNewMembers([])
    setMemberEmail('')
    setCreateError('')
  }

  const remove = async (id) => {
    await groupsService.remove(id)
    setItems(prev => prev.filter(x => x.id !== id))
  }

  const openMembersModal = async (group) => {
    setSelectedGroup(group)
    setMembers([])
    setLoadingMembers(true)
    setError('')
    setSuccess('')
    setEmailToAdd('')
    setIsAdmin(false)
    
    try {
      const data = await userGroupService.listMembers(group.id || group.grupo_id)
      setMembers(data)
      
      // Obtener usuario actual (intentar del contexto, token, o del backend)
      let currentUser = user || getUserFromToken()
      
      // Si no se pudo obtener del token, pedirlo al backend
      if (!currentUser) {
        try {
          const userData = await usersService.me()
          currentUser = userData
          console.log('✅ Usuario obtenido del backend:', userData)
        } catch (err) {
          console.error('❌ Error obteniendo usuario del backend:', err)
        }
      }
      
      // DEBUG: Ver qué datos tenemos
      console.log('👤 Usuario actual:', currentUser)
      console.log('👥 Miembros del grupo:', data)
      
      if (!currentUser) {
        console.error('❌ No se pudo obtener información del usuario')
        return
      }
      
      // Verificar si el usuario actual es admin del grupo
      // Comparar por usuario_id, user_id o email para mayor compatibilidad
      const currentUserMembership = data.find(m => 
        m.usuario_id === currentUser?.usuario_id || 
        m.usuario_id === currentUser?.user_id ||
        m.email === currentUser?.email
      )
      
      console.log('🔍 Membership encontrado:', currentUserMembership)
      console.log('🔑 Es admin?', currentUserMembership?.rol === 'admin')
      
      if (currentUserMembership && currentUserMembership.rol === 'admin') {
        setIsAdmin(true)
      }
    } catch (err) {
      setError('Error al cargar los miembros del grupo')
    } finally {
      setLoadingMembers(false)
    }
  }

  const closeMembersModal = () => {
    setSelectedGroup(null)
    setMembers([])
    setEmailToAdd('')
    setError('')
    setSuccess('')
  }

  const addUserByEmail = async (e) => {
    e.preventDefault()
    if (!emailToAdd.trim()) return
    
    setAddingUser(true)
    setError('')
    setSuccess('')
    
    try {
      const result = await userGroupService.addByEmail({
        email: emailToAdd.trim(),
        grupoId: selectedGroup.id || selectedGroup.grupo_id,
        rol: roleToAdd
      })
      
      setSuccess(`Usuario ${result.email} agregado exitosamente como ${roleToAdd}`)
      setEmailToAdd('')
      setRoleToAdd('miembro')
      
      // Recargar miembros
      const data = await userGroupService.listMembers(selectedGroup.id || selectedGroup.grupo_id)
      setMembers(data)
    } catch (err) {
      const detail = err?.response?.data?.detail
      setError(detail || 'Error al agregar el usuario')
    } finally {
      setAddingUser(false)
    }
  }

  const changeUserRole = async (member, nuevoRol) => {
    setError('')
    setSuccess('')
    
    try {
      await userGroupService.changeRole({
        usuarioId: member.usuario_id,
        grupoId: selectedGroup.id || selectedGroup.grupo_id,
        nuevoRol: nuevoRol
      })
      
      setSuccess(`Rol de ${member.nombre || member.email} cambiado a ${nuevoRol}`)
      
      // Recargar miembros del modal
      const data = await userGroupService.listMembers(selectedGroup.id || selectedGroup.grupo_id)
      setMembers(data)
      
      // Recargar todos los grupos para actualizar userRoles
      const groups = await groupsService.list()
      setItems(groups)
      await loadUserRoles(groups)
      
    } catch (err) {
      const detail = err?.response?.data?.detail
      setError(detail || 'Error al cambiar el rol')
    }
  }

  return (
    <div className="px-2 md:px-0">
      <div className="flex items-center justify-between py-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Grupos</h2>
          <p className="text-sm text-gray-600">Comparte tus finanzas con otros usuarios</p>
        </div>
        <button onClick={() => setOpen(true)} className="btn btn-primary">+ Nuevo Grupo</button>
      </div>

      {open && (
        <div className="card p-5 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingGroup ? 'Editar Grupo' : 'Nuevo Grupo'}
          </h3>
          <form onSubmit={save} className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nombre del grupo</label>
              <input value={form.nombre} onChange={(e)=>setForm({...form, nombre: e.target.value})} className="input" placeholder="Ej: Familia, Amigos, Compañeros..." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Descripción</label>
              <input value={form.descripcion} onChange={(e)=>setForm({...form, descripcion: e.target.value})} className="input" placeholder="Opcional" />
            </div>

            {/* Sección para agregar miembros - Solo al crear */}
            {!editingGroup && (
              <div className="border-t pt-4">
                <label className="block text-sm font-medium mb-3">Agregar miembros (opcional)</label>
                <p className="text-xs text-gray-500 mb-3">Serás agregado automáticamente como administrador del grupo</p>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="grid grid-cols-12 gap-2">
                  <input
                    type="email"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="input col-span-7"
                  />
                  <select
                    value={memberRole}
                    onChange={(e) => setMemberRole(e.target.value)}
                    className="input col-span-2 text-sm"
                  >
                    <option value="miembro">Miembro</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button
                    type="button"
                    onClick={addMemberToList}
                    className="btn btn-primary col-span-3 whitespace-nowrap"
                  >
                    + Agregar
                  </button>
                </div>
                
                {createError && <div className="text-red-600 text-sm">{createError}</div>}
                
                {/* Lista de miembros agregados */}
                {newMembers.length > 0 && (
                  <div className="space-y-2 mt-3">
                    <div className="text-sm font-medium">Miembros a agregar:</div>
                    {newMembers.map((member) => (
                      <div key={member.email} className="flex items-center justify-between p-2 bg-white border rounded">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{member.email}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${member.rol === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                            {member.rol}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeMemberFromList(member.email)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            )}

            <div className="flex items-center justify-end gap-3">
              <button type="button" onClick={cancelEdit} className="btn">Cancelar</button>
              <button disabled={!canSave} className="btn btn-primary">
                {editingGroup ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <div className="text-sm font-medium">Listado</div>
          {loading && <div className="text-sm text-gray-500">Cargando…</div>}
        </div>
        <div className="p-4 space-y-3">
          {items?.length ? items.map(g => (
            <div key={g.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{g.nombre || g.name}</div>
                  {g.descripcion && <div className="text-xs text-gray-500">{g.descripcion}</div>}
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={()=>openMembersModal(g)} className="text-blue-600 hover:underline text-sm">
                    👥 Ver miembros
                  </button>
                  {/* Solo mostrar opciones de gestión si el usuario es admin del grupo */}
                  {userRoles[g.id || g.grupo_id] === 'admin' && (
                    <>
                      <button onClick={()=>openMembersModal(g)} className="text-purple-600 hover:underline text-sm">
                        ➕ Agregar miembros
                      </button>
                      <button onClick={()=>openEditForm(g)} className="text-green-600 hover:underline text-sm">
                        ✏️ Editar
                      </button>
                      <button onClick={()=>remove(g.id)} className="text-red-600 hover:underline text-sm">
                        🗑️ Eliminar
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )) : <div className="text-sm text-gray-500">No tienes grupos creados.</div>}
        </div>
      </div>

      {/* Modal de miembros */}
      {selectedGroup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="card p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Miembros de "{selectedGroup.nombre || selectedGroup.name}"
              </h3>
              <button onClick={closeMembersModal} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>

            {/* Formulario para agregar usuario - Solo para admins */}
            {isAdmin && (
              <form onSubmit={addUserByEmail} className="mb-6 p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium mb-2">Agregar usuario por email</label>
                <div className="grid grid-cols-12 gap-2">
                  <input
                    type="email"
                    value={emailToAdd}
                    onChange={(e) => setEmailToAdd(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="input col-span-7"
                    disabled={addingUser}
                  />
                  <select
                    value={roleToAdd}
                    onChange={(e) => setRoleToAdd(e.target.value)}
                    className="input col-span-2 text-sm"
                    disabled={addingUser}
                  >
                    <option value="miembro">Miembro</option>
                    <option value="admin">Admin</option>
                  </select>
                  <button 
                    type="submit" 
                    disabled={!emailToAdd.trim() || addingUser}
                    className="btn btn-primary col-span-3 whitespace-nowrap"
                  >
                    {addingUser ? 'Agregando...' : 'Agregar'}
                  </button>
                </div>
                {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
                {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
              </form>
            )}

            {/* Mensaje para no admins */}
            {!isAdmin && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-700">
                  ℹ️ Solo los administradores del grupo pueden agregar nuevos miembros
                </p>
              </div>
            )}

            {/* Lista de miembros */}
            <div>
              <h4 className="text-sm font-medium mb-3">Miembros actuales</h4>
              {loadingMembers ? (
                <div className="text-sm text-gray-500">Cargando miembros...</div>
              ) : members.length > 0 ? (
                <div className="space-y-2">
                  {members.map((member) => (
                    <div key={member.usuario_id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className="font-medium">{member.nombre || member.email}</div>
                          {member.es_creador && (
                            <span className="text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-700 font-medium">
                              👑 Creador
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">{member.email}</div>
                      </div>
                      {/* Si es admin y no es creador, mostrar selector de rol */}
                      {isAdmin && !member.es_creador ? (
                        <select
                          value={member.rol}
                          onChange={(e) => changeUserRole(member, e.target.value)}
                          className="text-xs px-2 py-1 rounded border cursor-pointer"
                          style={{
                            backgroundColor: member.rol === 'admin' ? '#DBEAFE' : '#F3F4F6',
                            color: member.rol === 'admin' ? '#1E40AF' : '#374151'
                          }}
                        >
                          <option value="miembro">Miembro</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className={`text-xs px-2 py-1 rounded ${member.rol === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                          {member.rol}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500">No hay miembros en este grupo aún.</div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button onClick={closeMembersModal} className="btn">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
