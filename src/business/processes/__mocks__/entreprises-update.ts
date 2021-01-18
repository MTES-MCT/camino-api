import Entreprises from '../../../database/models/entreprises'
import EntreprisesEtablissements from '../../../database/models/entreprises-etablissements'

const dbEntreprisesCreees = [
  { id: 'pipo', legalSiren: undefined, nom: 'pipo' },
  { id: 'toto', legalSiren: 'toto', nom: 'toto' },
  { id: 'nunu', legalSiren: 'toto', nom: 'nunu' }
] as Entreprises[]

const dbEntreprisesEtablissementsCreees = [] as EntreprisesEtablissements[]

const apiEntreprisesCreees = [
  { id: 'papa', legalSiren: 'toto' }
] as Entreprises[]

const apiEntreprisesEtablissementsCreees = [
  { id: 'pipo', nom: 'pipo' },
  { id: 'toto', nom: 'toto' }
] as EntreprisesEtablissements[]

const dbEntreprisesModifiees = [
  { id: 'toto', legalSiren: 'toto', nom: 'toto' }
] as Entreprises[]

const dbEntreprisesEtablissementsModifies = [
  { id: 'toto', nom: 'toto' }
] as EntreprisesEtablissements[]

const apiEntreprisesModifiees = [
  { id: 'toto', legalSiren: 'papa' }
] as Entreprises[]

const apiEntreprisesEtablissementsModifiees = [
  { id: 'toto', nom: 'tutu' }
] as EntreprisesEtablissements[]

const dbEntreprisesSupprimeees = [
  { id: 'papa', legalSiren: 'toto', nom: 'toto' }
] as Entreprises[]
const dbEntreprisesEtablissementsSupprimeees = [
  {
    id: 'papa',
    dateDebut: '2000-01-01',
    entrepriseId: 'toto'
  }
] as EntreprisesEtablissements[]
const apiEntreprisesSupprimeees = [] as Entreprises[]

const dbEntreprisesExistantes = [
  { id: 'toto', legalSiren: 'toto', nom: 'toto' }
] as Entreprises[]

const dbEntreprisesEtablissementsExistants = [
  {
    id: 'toto',
    dateDebut: '2000-01-01',
    entrepriseId: 'toto'
  }
] as EntreprisesEtablissements[]

const apiEntreprisesExistantes = [
  { id: 'toto', legalSiren: 'toto', nom: 'toto' }
] as Entreprises[]

const apiEntreprisesEtablissementsExistantes = [
  {
    id: 'toto',
    dateDebut: '2000-01-01',
    entrepriseId: 'toto'
  }
] as EntreprisesEtablissements[]

const dbEntreprisesInexistantes = [] as Entreprises[]
const dbEntreprisesEtablissementsInexistants = [] as EntreprisesEtablissements[]
const apiEntreprisesInexistantes = [] as Entreprises[]

const apiEntreprisesEtablissmentsInexistantes = [] as EntreprisesEtablissements[]
const apiEntreprisesEtablissementsSupprimeees = [] as EntreprisesEtablissements[]

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
  apiEntreprisesEtablissementsExistantes,
  dbEntreprisesEtablissementsExistants,
  dbEntreprisesInexistantes,
  dbEntreprisesEtablissementsInexistants,
  apiEntreprisesInexistantes,
  apiEntreprisesEtablissmentsInexistantes,
  apiEntreprisesEtablissementsCreees,
  apiEntreprisesEtablissementsModifiees,
  apiEntreprisesEtablissementsSupprimeees
}
