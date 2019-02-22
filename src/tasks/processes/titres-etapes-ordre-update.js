import { titreEtapesOrdreUpdate } from '../queries/titre-etapes'

const titresEtapesOrdreUpdate = async titresDemarches => {
  const titresEtapesUpdated = titresDemarches.reduce(
    (arr, titreDemarche) => [
      ...arr,
      ...titreEtapesOrdreUpdate(titreDemarche.etapes)
    ],
    []
  )

  await Promise.all(titresEtapesUpdated)

  return `Mise à jour: ${titresEtapesUpdated.length} ordres d'étapes.`
}

export default titresEtapesOrdreUpdate
