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
  statutsIds: [] as string[],
  typesStatuts: [] as IAutorisationTitreTypeTitreStatut[],
  titresTypesAdministrations: [] as IAutorisationTitreTypeAdministration[]
}

const restrictions = {
  titresTypesTitresStatutsAdministrations: [] as IRestrictionTitreTypeTitreStatutAdministration[],
  titresTypesEtapesTypesAdministrations: [] as IRestrictionTitreTypeEtapeTypeAdministration[]
}

const autorisationsInit = async () => {
  autorisations.domaines = await autorisationsDomainesGet()

  autorisations.typesStatuts = await autorisationsTitresTypesTitresStatutsGet()

  autorisations.etapesTypes = await autorisationsEtapesTypesGet()

  // filtre les statuts non-autorisés à la lecture en public
  autorisations.statutsIds = autorisations.typesStatuts.reduce(
    (statutsIds: string[], ts) => {
      if (ts.publicLecture && !statutsIds.includes(ts.titreStatutId)) {
        statutsIds.push(ts.titreStatutId)
      }

      return statutsIds
    },
    []
  )

  autorisations.titresTypesAdministrations = await autorisationsTitresTypesAdministrationsGet()

  restrictions.titresTypesTitresStatutsAdministrations = await restrictionsTitresTypesTitresStatutsAdministrationsGet()

  restrictions.titresTypesEtapesTypesAdministrations = await restrictionsTitresTypesEtapesTypesAdministrationsGet()
}

export { autorisations, restrictions, autorisationsInit }
