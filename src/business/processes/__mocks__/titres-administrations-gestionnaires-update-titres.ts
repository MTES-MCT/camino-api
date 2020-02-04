import { ITitres, IAdministrations } from '../../../types'

const administrations = [
  { id: 'dgec' },
  { id: 'dgaln' },
  { id: 'ptmg' }
] as IAdministrations[]

const titresAdministrationGestionnaireVide = [
  { id: 'titre-id', domaineId: 'm' }
] as ITitres[]

const titresAdministrationGestionnaireInexistante = [
  {
    id: 'titre-id',
    administrationsGestionnaires: [{ id: 'inexistante' }]
  }
] as ITitres[]

const titresAdministrationGestionnaireExistante = [
  {
    id: 'titre-id',
    administrationsGestionnaires: [{ id: 'dgec' }]
  }
] as ITitres[]

export {
  administrations,
  titresAdministrationGestionnaireVide,
  titresAdministrationGestionnaireInexistante,
  titresAdministrationGestionnaireExistante
}
