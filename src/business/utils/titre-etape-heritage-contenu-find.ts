import { ITitreEtape } from '../../types'

const titreEtapeHeritageContenuFind = (
  sectionId: string,
  elementId: string,
  titreEtape: ITitreEtape,
  prevTitreEtape?: ITitreEtape | null
) => {
  let hasChanged = false
  let value

  const contenuSectionElement = titreEtape.heritageContenu![sectionId][
    elementId
  ]
  const prevContenuSectionElement = prevTitreEtape?.heritageContenu![sectionId][
    elementId
  ]

  const etapeId =
    prevContenuSectionElement?.etapeId && prevContenuSectionElement?.actif
      ? prevContenuSectionElement.etapeId
      : prevTitreEtape?.id

  if (contenuSectionElement.actif && prevTitreEtape) {
    const oldValue =
      titreEtape.contenu &&
      titreEtape.contenu[sectionId] &&
      titreEtape.contenu[sectionId][elementId]
    value =
      prevTitreEtape.contenu &&
      prevTitreEtape.contenu[sectionId] &&
      prevTitreEtape.contenu[sectionId][elementId]

    if (oldValue !== value) {
      hasChanged = true
    }
  }

  if (
    (etapeId || contenuSectionElement.etapeId) &&
    etapeId !== contenuSectionElement.etapeId
  ) {
    hasChanged = true
  }

  return { hasChanged, value, etapeId }
}

export { titreEtapeHeritageContenuFind }
