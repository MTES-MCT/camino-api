import { IAdministration, IDepartement } from '../../../types'

const departements = [{ id: '1' }, { id: '2' }, { id: '75' }] as IDepartement[]

const administrationApiTest = ({ id: 'test-ok' } as unknown) as IAdministration

const administrationsDbCreees = [] as IAdministration[]
const administrationsApiCreees = [{ id: 'toto' }]

const administrationsDbModifiees = [{ id: 'toto' }] as IAdministration[]
const administrationsApiModifiees = [{ id: 'papa' }]

const administrationsDbExistantes = [{ id: 'toto' }] as IAdministration[]
const administrationsApiExistantes = [{ id: 'toto' }]

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
