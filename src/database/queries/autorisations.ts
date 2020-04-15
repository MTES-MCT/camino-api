import {
  AutorisationsEtapesTypes,
  AutorisationsTitresTypesAdministrations,
  RestrictionsTitresTypesEtapesTypesAdministrations,
  AutorisationsTitresTypesTitresStatuts,
  RestrictionsTitresTypesTitresStatutsAdministrations
} from '../models/autorisations'

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
  autorisationsEtapesTypesGet,
  autorisationsTitresTypesTitresStatutsGet,
  autorisationsTitresTypesAdministrationsGet,
  restrictionsTitresTypesTitresStatutsAdministrationsGet,
  restrictionsTitresTypesEtapesTypesAdministrationsGet
}
