import {
  RestrictionsDomaines,
  RestrictionsTypesAdministrations,
  RestrictionsTypesStatuts,
  RestrictionsTypesStatutsAdministrations,
  RestrictionsEtapesTypes,
  RestrictionsEtapesTypesAdministrations
} from '../models/restrictions'

const restrictionsDomainesGet = async () => RestrictionsDomaines.query()

const restrictionsTypesStatutsGet = async () => RestrictionsTypesStatuts.query()

const restrictionsTypesAdministrationsGet = async () =>
  RestrictionsTypesAdministrations.query()

const restrictionsTypesStatutsAdministrationsGet = async () =>
  RestrictionsTypesStatutsAdministrations.query()

const restrictionsEtapesTypesGet = async () => RestrictionsEtapesTypes.query()

const restrictionsEtapesTypesAdministrationsGet = async () =>
  RestrictionsEtapesTypesAdministrations.query()

export {
  restrictionsDomainesGet,
  restrictionsTypesAdministrationsGet,
  restrictionsTypesStatutsGet,
  restrictionsTypesStatutsAdministrationsGet,
  restrictionsEtapesTypesGet,
  restrictionsEtapesTypesAdministrationsGet
}
