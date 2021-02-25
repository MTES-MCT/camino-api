import { ITitreEtape } from '../../types'

const titreEtapeHeritageContenuFind = (
  sectionId: string,
  elementId: string,
  titreEtape: ITitreEtape,
  prevTitreEtape?: ITitreEtape | null
) => {
  let hasChanged = false
  let value =
    titreEtape.contenu &&
    titreEtape.contenu[sectionId] &&
    titreEtape.contenu[sectionId][elementId]

  const heritage = titreEtape.heritageContenu![sectionId][elementId]
  const prevHeritage = prevTitreEtape?.heritageContenu![sectionId][elementId]

  const etapeId =
    prevHeritage?.etapeId && prevHeritage?.actif
      ? prevHeritage.etapeId
      : prevTitreEtape?.id

  if (heritage.actif && prevTitreEtape) {
    const oldValue = value
    value =
      prevTitreEtape.contenu &&
      prevTitreEtape.contenu[sectionId] &&
      prevTitreEtape.contenu[sectionId][elementId]

    if (oldValue !== value) {
      hasChanged = true
    }
  }

  if ((etapeId || heritage.etapeId) && etapeId !== heritage.etapeId) {
    hasChanged = true
  }

  return { hasChanged, value, etapeId }
}

export { titreEtapeHeritageContenuFind }
