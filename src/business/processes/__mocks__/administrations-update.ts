import { IAdministrations, IDepartements } from '../../../types'

const departements = [{ id: '1' }, { id: '2' }, { id: '75' }] as IDepartements[]

const departement = { id: 'a' } as IDepartements

const administrationsDbCreees = [] as IAdministrations[]
const administrationsApiCreees = [{ id: 'toto' }]

const administrationsDbModifiees = [{ id: 'toto' }] as IAdministrations[]
const administrationsApiModifiees = [{ id: 'papa' }]

const administrationsDbExistantes = [{ id: 'toto' }] as IAdministrations[]
const administrationsApiExistantes = [{ id: 'toto' }]

export {
  departement,
  departements,
  administrationsDbCreees,
  administrationsApiCreees,
  administrationsDbModifiees,
  administrationsApiModifiees,
  administrationsDbExistantes,
  administrationsApiExistantes
}
