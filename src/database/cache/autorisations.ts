import {
  IAutorisationDomaine,
  IAutorisationTitreTypeAdministration,
  IAutorisationTitreTypeTitreStatut,
  IAutorisationTitreTypeTitreStatutAdministration,
  IAutorisationEtapeType,
  IAutorisationTitreTypeEtapeTypeAdministration
} from '../../types'

import { debug } from '../../config/index'

import {
  autorisationsDomainesGet,
  autorisationsTitresTypesAdministrationsGet,
  autorisationsTitresTypesTitresStatutsGet,
  autorisationsTitresTypesTitresStatutsAdministrationsGet,
  autorisationsEtapesTypesGet,
  autorisationsTitresTypesEtapesTypesAdministrationsGet
} from '../queries/autorisations'

const autorisations = {
  domaines: [] as IAutorisationDomaine[],
  etapesTypes: [] as IAutorisationEtapeType[],
  statutIds: [] as string[],
  typesStatuts: [] as IAutorisationTitreTypeTitreStatut[],
  titresTypesAdministrations: [] as IAutorisationTitreTypeAdministration[],
  titresTypesTitresStatutsAdministrations: [] as IAutorisationTitreTypeTitreStatutAdministration[],
  titresTypesEtapesTypesAdministrations: [] as IAutorisationTitreTypeEtapeTypeAdministration[]
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

  autorisations.titresTypesTitresStatutsAdministrations = await autorisationsTitresTypesTitresStatutsAdministrationsGet()

  autorisations.titresTypesEtapesTypesAdministrations = await autorisationsTitresTypesEtapesTypesAdministrationsGet()
}

export default autorisations

export { autorisationsInit }
