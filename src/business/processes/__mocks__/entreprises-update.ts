import { IEntreprise, IEntrepriseEtablissement } from '../../../types'

const dbEntreprisesCreees = [
  { id: 'pipo', legalSiren: undefined, nom: 'pipo' },
  { id: 'toto', legalSiren: 'toto', nom: 'toto' },
  { id: 'nunu', legalSiren: 'toto', nom: 'nunu' }
]
const dbEntreprisesEtablissementsCreees = [] as IEntrepriseEtablissement[]
const apiEntreprisesCreees = [{ id: 'papa', legalSiren: 'toto' }]

const dbEntreprisesModifiees = [{ id: 'toto', legalSiren: 'toto', nom: 'toto' }]
const dbEntreprisesEtablissementsModifies = [] as IEntrepriseEtablissement[]
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
const apiEntreprisesSupprimeees = [] as IEntreprise[]

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
const dbEntreprisesInexistantes = [] as IEntreprise[]
const dbEntreprisesEtablissementsInexistants = [] as IEntrepriseEtablissement[]
const apiEntreprisesInexistantes = [] as IEntreprise[]

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
