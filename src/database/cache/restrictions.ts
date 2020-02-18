import {
  IRestrictionDomaine,
  IRestrictionTypeAdministration,
  IRestrictionTypeStatut,
  IRestrictionTypeStatutAdministration,
  IRestrictionEtapeType,
  IRestrictionEtapeTypeAdministration
} from '../../types'

import { debug } from '../../config/index'

import { titresTypesGet, titresStatutsGet } from '../queries/metas'

import {
  restrictionsDomainesGet,
  restrictionsTypesAdministrationsGet,
  restrictionsTypesStatutsGet,
  restrictionsTypesStatutsAdministrationsGet,
  restrictionsEtapesTypesGet,
  restrictionsEtapesTypesAdministrationsGet
} from '../queries/restrictions'

const restrictions = {
  domaines: [] as IRestrictionDomaine[],
  typesAdministrations: [] as IRestrictionTypeAdministration[],
  typesStatuts: [] as IRestrictionTypeStatut[],
  statutIds: [] as string[],
  typesStatutsAdministrations: [] as IRestrictionTypeStatutAdministration[],
  etapesTypes: [] as IRestrictionEtapeType[],
  etapesTypesAdministrations: [] as IRestrictionEtapeTypeAdministration[]
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
