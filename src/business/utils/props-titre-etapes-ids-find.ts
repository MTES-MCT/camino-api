import {
  ITitreDemarche,
  ITitrePropsTitreEtapesIds,
  ITitreSection
} from '../../types'
import { titreContenuEtapeIdFind } from '../rules/titre-contenu-etape-id-find'

const propsTitreEtapesIdsFind = (
  titreStatutId: string,
  titreDemarches: ITitreDemarche[],
  titrePropsEtapesTypes?: ITitreSection[] | null
) => {
  if (!titrePropsEtapesTypes) return null

  return titrePropsEtapesTypes.reduce(
    (
      propsTitreEtapesIds: ITitrePropsTitreEtapesIds | null,
      { sectionId, elementId }
    ) => {
      // trouve l'id de l'étape qui contient l'élément dans la section
      const titreEtapeId = titreContenuEtapeIdFind(
        titreDemarches,
        titreStatutId,
        sectionId,
        elementId
      )

      // si une étape est trouvée
      if (titreEtapeId) {
        if (!propsTitreEtapesIds) {
          propsTitreEtapesIds = {}
        }

        if (!propsTitreEtapesIds[sectionId]) {
          propsTitreEtapesIds[sectionId] = {}
        }

        propsTitreEtapesIds[sectionId][elementId] = titreEtapeId
      }

      return propsTitreEtapesIds
    },
    null
  )
}

export { propsTitreEtapesIdsFind }
