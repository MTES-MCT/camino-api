import { IAdministration, IDepartement } from '../../../types'

const departements = [{ id: '1' }, { id: '2' }, { id: '75' }] as IDepartement[]

const administrationApiTest = { id: 'test-ok' } as IAdministration

const administrationsDbCreees = [] as IAdministration[]
const administrationsApiCreees = [{ id: 'toto' }] as IAdministration[]

const administrationsDbModifiees = [{ id: 'toto' }] as IAdministration[]
const administrationsApiModifiees = [{ id: 'papa' }] as IAdministration[]

const administrationsDbExistantes = [{ id: 'toto' }] as IAdministration[]
const administrationsApiExistantes = [{ id: 'toto' }] as IAdministration[]

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
