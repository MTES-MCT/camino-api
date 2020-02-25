import {
  IAutorisationDomaine,
  IAutorisationTitreTypeAdministration,
  IAutorisationTitreTypeTitreStatut,
  IRestrictionTitreTypeTitreStatutAdministration,
  IAutorisationEtapeType,
  IRestrictionTitreTypeEtapeTypeAdministration
} from '../../types'

import { debug } from '../../config/index'

import {
  autorisationsDomainesGet,
  autorisationsTitresTypesAdministrationsGet,
  autorisationsTitresTypesTitresStatutsGet,
  restrictionsTitresTypesTitresStatutsAdministrationsGet,
  autorisationsEtapesTypesGet,
  restrictionsTitresTypesEtapesTypesAdministrationsGet
} from '../queries/autorisations'

const autorisations = {
  domaines: [] as IAutorisationDomaine[],
  etapesTypes: [] as IAutorisationEtapeType[],
  statutIds: [] as string[],
  typesStatuts: [] as IAutorisationTitreTypeTitreStatut[],
  titresTypesAdministrations: [] as IAutorisationTitreTypeAdministration[],
}

const restrictions = {
  titresTypesTitresStatutsAdministrations: [] as IRestrictionTitreTypeTitreStatutAdministration[],
  titresTypesEtapesTypesAdministrations: [] as IRestrictionTitreTypeEtapeTypeAdministration[]
}

const autorisationsInit = async () => {
  if (debug) return

  autorisations.domaines = await autorisationsDomainesGet()

  autorisations.typesStatuts = await autorisationsTitresTypesTitresStatutsGet()

  autorisations.etapesTypes = await autorisationsEtapesTypesGet()

  // filtre les statuts non-autorisés à la lecture en public
  autorisations.statutIds = autorisations.typesStatuts.reduce(
    (statutIds: string[], ts) => {
      if (ts.publicLecture && !statutIds.includes(ts.titreStatutId)) {
        statutIds.push(ts.titreStatutId)
      }

      return statutIds
    },
    []
  )

  autorisations.titresTypesAdministrations = await autorisationsTitresTypesAdministrationsGet()

  restrictions.titresTypesTitresStatutsAdministrations = await restrictionsTitresTypesTitresStatutsAdministrationsGet()

  restrictions.titresTypesEtapesTypesAdministrations = await restrictionsTitresTypesEtapesTypesAdministrationsGet()
}

export { autorisations, restrictions, autorisationsInit }
