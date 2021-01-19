import {
  IContenu,
  ITitreDemarche,
  ITitreEtape,
  ITitrePropsTitreEtapesIds
} from '../../../types'

const titreContenuFormat = (
  propsTitreEtapesIds: ITitrePropsTitreEtapesIds,
  titreDemarches?: ITitreDemarche[] | undefined | null
) => {
  if (!propsTitreEtapesIds || !titreDemarches?.length) return {}

  const etapesIndex = {} as { [id: string]: ITitreEtape }

  titreDemarches.forEach((titreDemarche: ITitreDemarche) => {
    if (titreDemarche.etapes) {
      titreDemarche.etapes.forEach(etape => {
        if (!etapesIndex[etape.id]) {
          etapesIndex[etape.id] = etape
        }
      })
    }
  })

  const contenu = {} as IContenu

  Object.keys(propsTitreEtapesIds).forEach((sectionId: string) => {
    Object.keys(propsTitreEtapesIds[sectionId]).forEach(elementId => {
      const etapeId = propsTitreEtapesIds[sectionId][elementId]

      if (etapeId) {
        const etape = etapesIndex[etapeId]

        if (
          etape &&
          etape.contenu &&
          etape.contenu[sectionId] &&
          etape.contenu[sectionId][elementId] !== undefined
        ) {
          if (!contenu[sectionId]) {
            contenu[sectionId] = {}
          }

          contenu[sectionId][elementId] = etape.contenu[sectionId][elementId]
        }
      }
    })
  })

  return contenu
}

export { titreContenuFormat }
