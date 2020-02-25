import {
  AutorisationsDomaines,
  AutorisationsEtapesTypes,
  AutorisationsTitresTypesAdministrations,
  RestrictionsTitresTypesEtapesTypesAdministrations,
  AutorisationsTitresTypesTitresStatuts,
  RestrictionsTitresTypesTitresStatutsAdministrations
} from '../models/autorisations'

const autorisationsDomainesGet = async () => AutorisationsDomaines.query()

const autorisationsEtapesTypesGet = async () => AutorisationsEtapesTypes.query()

const autorisationsTitresTypesTitresStatutsGet = async () =>
  AutorisationsTitresTypesTitresStatuts.query()

const autorisationsTitresTypesAdministrationsGet = async () =>
  AutorisationsTitresTypesAdministrations.query()

const restrictionsTitresTypesTitresStatutsAdministrationsGet = async () =>
  RestrictionsTitresTypesTitresStatutsAdministrations.query()

const restrictionsTitresTypesEtapesTypesAdministrationsGet = async () =>
  RestrictionsTitresTypesEtapesTypesAdministrations.query()

export {
  autorisationsDomainesGet,
  autorisationsEtapesTypesGet,
  autorisationsTitresTypesTitresStatutsGet,
  autorisationsTitresTypesAdministrationsGet,
  restrictionsTitresTypesTitresStatutsAdministrationsGet,
  restrictionsTitresTypesEtapesTypesAdministrationsGet
}
