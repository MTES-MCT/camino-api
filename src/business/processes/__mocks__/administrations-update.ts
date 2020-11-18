import Administrations from '../../../database/models/administrations'

const administrationApiTest = { id: 'test-ok' } as Administrations

const administrationsDbCreees = [
  { id: 'toto', typeId: 'min' }
] as Administrations[]
const administrationsApiCreees = [] as Administrations[]

const administrationsDbModifiees = [
  { id: 'toto', departementId: '49', typeId: 'pre' }
] as Administrations[]
const administrationsApiModifiees = [
  { id: 'papa', departementId: '49', typeId: 'pre' }
] as Administrations[]

const administrationsDbExistantes = [
  { id: 'toto', departementId: '75', typeId: 'pre' }
] as Administrations[]
const administrationsApiExistantes = [
  { id: 'toto', departementId: '75', typeId: 'pre' }
] as Administrations[]

export {
  administrationApiTest,
  administrationsDbCreees,
  administrationsApiCreees,
  administrationsDbModifiees,
  administrationsApiModifiees,
  administrationsDbExistantes,
  administrationsApiExistantes
}
