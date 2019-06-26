import { titreEtapesOrdreUpdate } from '../queries/titre-etapes'

const titresEtapesOrdreUpdate = async titresDemarches => {
  const titresEtapesUpdated = titresDemarches.reduce(
    (arr, titreDemarche) => [
      ...arr,
      ...titreEtapesOrdreUpdate(titreDemarche.etapes)
    ],
    []
  )

  if (titresEtapesUpdated.length) {
    const titresEtapesUpdatedQueries = titresEtapesUpdated.map(q =>
      q.then(log => console.log(log))
    )
    await Promise.all(titresEtapesUpdatedQueries)
  }

  return `Mise à jour: ${titresEtapesUpdated.length} ordres d'étapes.`
}

export default titresEtapesOrdreUpdate
