import {
  ITitreDemarche,
  IContenusTitreEtapesIds,
  IContenuId
} from '../../types'
import { titreContenuEtapeFind } from '../rules/titre-prop-etape-find'

const contenusTitreEtapesIdsFind = (
  titreStatutId: string,
  titreDemarches: ITitreDemarche[],
  contenuIds?: IContenuId[] | null
) => {
  if (!contenuIds) return null

  const titrePropsEtapesIds = contenuIds.reduce(
    (
      contenusTitreEtapesIds: IContenusTitreEtapesIds | null,
      { sectionId, elementId }
    ) => {
      // trouve l'id de l'étape qui contient l'élément dans la section
      const titreEtape = titreContenuEtapeFind(
        { sectionId, elementId },
        titreDemarches,
        titreStatutId
      )

      // si une étape est trouvée
      if (titreEtape) {
        if (!contenusTitreEtapesIds) {
          contenusTitreEtapesIds = {}
        }

        if (!contenusTitreEtapesIds[sectionId]) {
          contenusTitreEtapesIds[sectionId] = {}
        }

        contenusTitreEtapesIds[sectionId][elementId] = titreEtape.id
      }

      return contenusTitreEtapesIds
    },
    null
  )

  return titrePropsEtapesIds
}

export { contenusTitreEtapesIdsFind }
