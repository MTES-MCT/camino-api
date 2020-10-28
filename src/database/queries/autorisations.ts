import { AutorisationsTitresTypesTitresStatuts } from '../models/autorisations'
import AdministrationsTitresTypes from '../models/administrations-titres-types'
import AdministrationsTitresTypesEtapesTypes from '../models/administrations-titres-types-etapes-types'
import AdministrationsTitresTypesTitresStatuts from '../models/administrations-titres-types-titres-statuts'

const autorisationsTitresTypesTitresStatutsGet = async () =>
  AutorisationsTitresTypesTitresStatuts.query()

const AdministrationsTitresTypesGet = async () =>
  AdministrationsTitresTypes.query()

const AdministrationsTitresTypesTitresStatutsGet = async () =>
  AdministrationsTitresTypesTitresStatuts.query()

const AdministrationsTitresTypesEtapesTypesGet = async () =>
  AdministrationsTitresTypesEtapesTypes.query()

export {
  autorisationsTitresTypesTitresStatutsGet,
  AdministrationsTitresTypesGet,
  AdministrationsTitresTypesTitresStatutsGet,
  AdministrationsTitresTypesEtapesTypesGet
}
