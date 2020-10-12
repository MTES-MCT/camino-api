import {
  IAutorisationTitreTypeAdministration,
  IAutorisationTitreTypeTitreStatut,
  IAutorisationEtapeType
} from '../../types'

import {
  autorisationsTitresTypesAdministrationsGet,
  autorisationsTitresTypesTitresStatutsGet,
  autorisationsEtapesTypesGet
} from '../queries/autorisations'

const autorisations = {
  etapesTypes: [] as IAutorisationEtapeType[],
  statutsIds: [] as string[],
  typesStatuts: [] as IAutorisationTitreTypeTitreStatut[],
  titresTypesAdministrations: [] as IAutorisationTitreTypeAdministration[]
}

const autorisationsInit = async () => {
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
}

export { autorisations, autorisationsInit }
