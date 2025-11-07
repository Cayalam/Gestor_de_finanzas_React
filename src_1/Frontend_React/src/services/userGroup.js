import api from './api'

export async function add({ usuarioId, grupoId, rol }) {
   const { data } = await api.post('/usuario-grupo/', { usuarioId, grupoId, rol })
  return data
}

export async function listByUsuario(usuarioId) {
  const { data } = await api.get(`/usuario-grupo/usuario/${usuarioId}`)
  return data
}

export async function listByGrupo(grupoId) {
  const { data } = await api.get(`/usuario-grupo/grupo/${grupoId}`)
  return data
}

export async function get(usuarioId, grupoId) {
  const { data } = await api.get(`/usuario-grupo/${usuarioId}/${grupoId}`)
  return data
}

export async function remove(usuarioId, grupoId) {
  const { data } = await api.delete(`/usuario-grupo/${usuarioId}/${grupoId}/`)
  return data
}

export default { add, listByUsuario, listByGrupo, get, remove }
