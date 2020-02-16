import { ITitre, IAdministration } from '../../../types'

const administrations = [
  { id: 'dgec' },
  { id: 'dgaln' },
  { id: 'ptmg' }
] as IAdministration[]

const titresAdministrationGestionnaireVide = [
  { id: 'titre-id', domaineId: 'm' }
] as ITitre[]

const titresAdministrationGestionnaireInexistante = [
  {
    id: 'titre-id',
    administrationsGestionnaires: [{ id: 'inexistante' }]
  }
] as ITitre[]

const titresAdministrationGestionnaireExistante = [
  {
    id: 'titre-id',
    administrationsGestionnaires: [{ id: 'dgec' }]
  }
] as ITitre[]

export {
  administrations,
  titresAdministrationGestionnaireVide,
  titresAdministrationGestionnaireInexistante,
  titresAdministrationGestionnaireExistante
}
