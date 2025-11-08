import api from './api'

/**
 * Aportar dinero a un grupo
 * Crea un egreso en la cuenta personal del usuario y un ingreso en el grupo
 * @param {number} grupoId - ID del grupo al que se aporta
 * @param {number} monto - Monto a aportar
 * @param {number} bolsilloUsuarioId - ID del bolsillo personal desde donde se toma el dinero
 * @returns {Promise} - Información de la aportación creada
 */
export async function contribute(grupoId, monto, bolsilloUsuarioId) {
  const { data } = await api.post('/aportaciones/aportar/', {
    grupo: grupoId,
    monto: monto,
    bolsillo_usuario: bolsilloUsuarioId
  })
  return data
}

export default { contribute }
