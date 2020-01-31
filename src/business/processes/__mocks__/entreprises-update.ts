import { IEntreprises, IEntreprisesEtablissements } from '../../../types'

const dbEntreprisesCreees = [
  { id: 'pipo', legalSiren: undefined, nom: 'pipo' },
  { id: 'toto', legalSiren: 'toto', nom: 'toto' },
  { id: 'nunu', legalSiren: 'toto', nom: 'nunu' }
]
const dbEntreprisesEtablissementsCreees = [] as IEntreprisesEtablissements[]
const apiEntreprisesCreees = [{ id: 'papa', legalSiren: 'toto' }]

const dbEntreprisesModifiees = [{ id: 'toto', legalSiren: 'toto', nom: 'toto' }]
const dbEntreprisesEtablissementsModifies = [] as IEntreprisesEtablissements[]
const apiEntreprisesModifiees = [{ id: 'toto', legalSiren: 'papa' }]

const dbEntreprisesSupprimeees = [
  { id: 'papa', legalSiren: 'toto', nom: 'toto' }
]
const dbEntreprisesEtablissementsSupprimeees = [
  {
    id: 'papa',
    legalSiren: 'toto',
    dateDebut: '2000-01-01',
    entrepriseId: 'toto'
  }
]
const apiEntreprisesSupprimeees = [] as IEntreprises[]

const dbEntreprisesExistantes = [
  { id: 'toto', legalSiren: 'toto', nom: 'toto' }
]
const dbEntreprisesEtablissementsExistants = [
  {
    id: 'toto',
    legalSiren: 'toto',
    dateDebut: '2000-01-01',
    entrepriseId: 'toto'
  }
]
const apiEntreprisesExistantes = [{ id: 'toto', legalSiren: 'toto' }]
const entreprisesEtablissementsApiExistantes = [
  {
    id: 'toto',
    legalSiren: 'toto',
    dateDebut: '2000-01-01',
    entrepriseId: 'toto'
  }
]
const dbEntreprisesInexistantes = [] as IEntreprises[]
const dbEntreprisesEtablissementsInexistants = [] as IEntreprisesEtablissements[]
const apiEntreprisesInexistantes = [] as IEntreprises[]

export {
  dbEntreprisesCreees,
  dbEntreprisesEtablissementsCreees,
  apiEntreprisesCreees,
  dbEntreprisesModifiees,
  dbEntreprisesEtablissementsModifies,
  apiEntreprisesModifiees,
  dbEntreprisesSupprimeees,
  dbEntreprisesEtablissementsSupprimeees,
  apiEntreprisesSupprimeees,
  dbEntreprisesExistantes,
  apiEntreprisesExistantes,
  entreprisesEtablissementsApiExistantes,
  dbEntreprisesEtablissementsExistants,
  dbEntreprisesInexistantes,
  dbEntreprisesEtablissementsInexistants,
  apiEntreprisesInexistantes
}
