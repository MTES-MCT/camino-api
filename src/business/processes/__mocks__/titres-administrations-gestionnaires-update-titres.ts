import Administrations from '../../../database/models/administrations'
import Titres from '../../../database/models/titres'

const administrations = [
  { id: 'dgec' },
  { id: 'dgaln' },
  { id: 'ptmg' }
] as Administrations[]

const titresAdministrationGestionnaireVide = [
  { id: 'titre-id', domaineId: 'm' }
] as Titres[]

const titresAdministrationGestionnaireInexistante = [
  {
    id: 'titre-id',
    administrationsGestionnaires: [{ id: 'inexistante' }]
  }
] as Titres[]

const titresAdministrationGestionnaireExistante = [
  {
    id: 'titre-id',
    administrationsGestionnaires: [{ id: 'dgec' }]
  }
] as Titres[]

export {
  administrations,
  titresAdministrationGestionnaireVide,
  titresAdministrationGestionnaireInexistante,
  titresAdministrationGestionnaireExistante
}
