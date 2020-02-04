import { IAdministrations, IDepartements } from '../../../types'

const departements = [{ id: '1' }, { id: '2' }, { id: '75' }] as IDepartements[]

const administrationApiTest = ({ id: 'test-ok' } as unknown) as IAdministrations

const administrationsDbCreees = [] as IAdministrations[]
const administrationsApiCreees = [{ id: 'toto' }]

const administrationsDbModifiees = [{ id: 'toto' }] as IAdministrations[]
const administrationsApiModifiees = [{ id: 'papa' }]

const administrationsDbExistantes = [{ id: 'toto' }] as IAdministrations[]
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
