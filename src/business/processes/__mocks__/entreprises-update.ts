import { IEntreprise, IEntrepriseEtablissement } from '../../../types'

const dbEntreprisesCreees = [
  { id: 'pipo', legalSiren: undefined, nom: 'pipo' },
  { id: 'toto', legalSiren: 'toto', nom: 'toto' },
  { id: 'nunu', legalSiren: 'toto', nom: 'nunu' }
] as IEntreprise[]

const dbEntreprisesEtablissementsCreees = [] as IEntrepriseEtablissement[]

const apiEntreprisesCreees = [
  { id: 'papa', legalSiren: 'toto' }
] as IEntreprise[]

const apiEntreprisesEtablissementsCreees = [
  { id: 'pipo', nom: 'pipo' },
  { id: 'toto', nom: 'toto' }
] as IEntrepriseEtablissement[]

const dbEntreprisesModifiees = [
  { id: 'toto', legalSiren: 'toto', nom: 'toto' }
] as IEntreprise[]

const dbEntreprisesEtablissementsModifies = [
  { id: 'toto', nom: 'toto' }
] as IEntrepriseEtablissement[]

const apiEntreprisesModifiees = [
  { id: 'toto', legalSiren: 'papa' }
] as IEntreprise[]

const apiEntreprisesEtablissementsModifiees = [
  { id: 'toto', nom: 'tutu' }
] as IEntrepriseEtablissement[]

const dbEntreprisesSupprimeees = [
  { id: 'papa', legalSiren: 'toto', nom: 'toto' }
] as IEntreprise[]
const dbEntreprisesEtablissementsSupprimeees = [
  {
    id: 'papa',
    dateDebut: '2000-01-01',
    entrepriseId: 'toto'
  }
] as IEntrepriseEtablissement[]
const apiEntreprisesSupprimeees = [] as IEntreprise[]

const dbEntreprisesExistantes = [
  { id: 'toto', legalSiren: 'toto', nom: 'toto' }
] as IEntreprise[]

const dbEntreprisesEtablissementsExistants = [
  {
    id: 'toto',
    dateDebut: '2000-01-01',
    entrepriseId: 'toto'
  }
] as IEntrepriseEtablissement[]

const apiEntreprisesExistantes = [
  { id: 'toto', legalSiren: 'toto' }
] as IEntreprise[]

const apiEntreprisesEtablissementsExistantes = [
  {
    id: 'toto',
    dateDebut: '2000-01-01',
    entrepriseId: 'toto'
  }
] as IEntrepriseEtablissement[]

const dbEntreprisesInexistantes = [] as IEntreprise[]
const dbEntreprisesEtablissementsInexistants = [] as IEntrepriseEtablissement[]
const apiEntreprisesInexistantes = [] as IEntreprise[]

const apiEntreprisesEtablissmentsInexistantes = [] as IEntrepriseEtablissement[]
const apiEntreprisesEtablissementsSupprimeees = [] as IEntrepriseEtablissement[]

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
