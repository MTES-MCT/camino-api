import {
  AutorisationsDomaines,
  AutorisationsEtapesTypes,
  AutorisationsTitresTypesAdministrations,
  AutorisationsTitresTypesEtapesTypesAdministrations,
  AutorisationsTitresTypesTitresStatuts,
  AutorisationsTitresTypesTitresStatutsAdministrations
} from '../models/autorisations'

const autorisationsDomainesGet = async () => AutorisationsDomaines.query()

const autorisationsEtapesTypesGet = async () => AutorisationsEtapesTypes.query()

const autorisationsTitresTypesTitresStatutsGet = async () =>
  AutorisationsTitresTypesTitresStatuts.query()

const autorisationsTitresTypesAdministrationsGet = async () =>
  AutorisationsTitresTypesAdministrations.query()

const autorisationsTitresTypesTitresStatutsAdministrationsGet = async () =>
  AutorisationsTitresTypesTitresStatutsAdministrations.query()

const autorisationsTitresTypesEtapesTypesAdministrationsGet = async () =>
  AutorisationsTitresTypesEtapesTypesAdministrations.query()

export {
  autorisationsDomainesGet,
  autorisationsEtapesTypesGet,
  autorisationsTitresTypesAdministrationsGet,
  autorisationsTitresTypesEtapesTypesAdministrationsGet,
  autorisationsTitresTypesTitresStatutsGet,
  autorisationsTitresTypesTitresStatutsAdministrationsGet
}
