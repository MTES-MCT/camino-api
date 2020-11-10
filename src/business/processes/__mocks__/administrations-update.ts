import Administrations from '../../../database/models/administrations'
import Departements from '../../../database/models/departements'

const departements = [{ id: '1' }, { id: '2' }, { id: '75' }] as Departements[]

const administrationApiTest = { id: 'test-ok' } as Administrations

const administrationsDbCreees = [] as Administrations[]
const administrationsApiCreees = [{ id: 'toto' }] as Administrations[]

const administrationsDbModifiees = [{ id: 'toto' }] as Administrations[]
const administrationsApiModifiees = [{ id: 'papa' }] as Administrations[]

const administrationsDbExistantes = [{ id: 'toto' }] as Administrations[]
const administrationsApiExistantes = [{ id: 'toto' }] as Administrations[]

export {
  departements,
  administrationApiTest,
  administrationsDbCreees,
  administrationsApiCreees,
  administrationsDbModifiees,
  administrationsApiModifiees,
  administrationsDbExistantes,
  administrationsApiExistantes
}
