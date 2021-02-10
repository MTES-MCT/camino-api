import {
  IContenu,
  ITitreDemarche,
  ITitreEtape,
  IContenusTitreEtapesIds
} from '../../../types'

/**
 * Formate le contenu du titre d'après les contenus d'étape
 * @param contenusTitreEtapesIds - index des ids d'étape qui contiennent le contenu
 * @param titreDemarches - démarches du titre
 * @returns l'objet contenu formaté
 */

const titreContenuFormat = (
  contenusTitreEtapesIds: IContenusTitreEtapesIds,
  titreDemarches?: ITitreDemarche[] | null
) => {
  if (!titreDemarches?.length) return {}

  const etapesIndex = {} as { [id: string]: ITitreEtape }

  titreDemarches.forEach((titreDemarche: ITitreDemarche) => {
    if (titreDemarche.etapes) {
      titreDemarche.etapes.forEach(etape => {
        etapesIndex[etape.id] = etape
      })
    }
  })

  const contenu = {} as IContenu

  Object.keys(contenusTitreEtapesIds).forEach((sectionId: string) => {
    Object.keys(contenusTitreEtapesIds[sectionId]).forEach(propId => {
      const etapeId = contenusTitreEtapesIds[sectionId][propId]

      const etape = etapesIndex[etapeId]

      if (
        etape?.contenu &&
        etape.contenu[sectionId] &&
        etape.contenu[sectionId][propId] !== undefined
      ) {
        if (!contenu[sectionId]) {
          contenu[sectionId] = {}
        }

        contenu[sectionId][propId] = etape.contenu[sectionId][propId]
      }
    })
  })

  return contenu
}

export { titreContenuFormat }
