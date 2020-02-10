import {
  IRestrictionsDomaines,
  IRestrictionsTypesAdministrations,
  IRestrictionsTypesStatuts,
  IRestrictionsTypesStatutsAdministrations,
  IRestrictionsEtapesTypes,
  IRestrictionsEtapesTypesAdministrations
} from '../../types'

import { debug } from '../../config/index'

import { titresTypesGet, titresStatutsGet } from '../../database/queries/metas'

import {
  restrictionsDomainesGet,
  restrictionsTypesAdministrationsGet,
  restrictionsTypesStatutsGet,
  restrictionsTypesStatutsAdministrationsGet,
  restrictionsEtapesTypesGet,
  restrictionsEtapesTypesAdministrationsGet
} from '../../database/queries/restrictions'

const restrictions = {
  domaines: [] as IRestrictionsDomaines[],
  typesAdministrations: [] as IRestrictionsTypesAdministrations[],
  typesStatuts: [] as IRestrictionsTypesStatuts[],
  statutIds: [] as string[],
  typesStatutsAdministrations: [] as IRestrictionsTypesStatutsAdministrations[],
  etapesTypes: [] as IRestrictionsEtapesTypes[],
  etapesTypesAdministrations: [] as IRestrictionsEtapesTypesAdministrations[]
}

const restrictionsInit = async () => {
  if (debug) return

  restrictions.domaines = await restrictionsDomainesGet()

  restrictions.typesAdministrations = await restrictionsTypesAdministrationsGet()

  restrictions.typesStatuts = await restrictionsTypesStatutsGet()

  const titresTypes = await titresTypesGet()
  const titresStatuts = await titresStatutsGet()

  // calcule les statuts interdits pour tous les types
  // pour ne pas les afficher dans les filtres
  restrictions.statutIds = titresStatuts.reduce(
    (statutIds: string[], titreStatut) => {
      const typesRestricted = restrictions.typesStatuts.filter(
        t => t.titreStatutId === titreStatut.id && t.publicLectureInterdit
      )

      if (typesRestricted.length === titresTypes.length) {
        statutIds.push(titreStatut.id)
      }

      return statutIds
    },
    []
  )

  restrictions.typesStatutsAdministrations = await restrictionsTypesStatutsAdministrationsGet()

  restrictions.etapesTypes = await restrictionsEtapesTypesGet()

  restrictions.etapesTypesAdministrations = await restrictionsEtapesTypesAdministrationsGet()
}

export default restrictions

export { restrictionsInit }
