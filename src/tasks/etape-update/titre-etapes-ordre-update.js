import { titreEtapesOrdreUpdate } from '../titre-etapes'

const titresEtapesOrdreUpdate = async titreDemarche => {
  const titresEtapesUpdated = titreEtapesOrdreUpdate(titreDemarche.etapes)

  if (titresEtapesUpdated && titresEtapesUpdated.length) {
    const titresEtapesOrdreUpdateQueries = titresEtapesUpdated.map(q =>
      q.then(log => console.log(log))
    )
    await Promise.all(titresEtapesOrdreUpdateQueries)
  }

  return `Mise à jour: ${titresEtapesUpdated.length} ordres d'étapes.`
}

export default titresEtapesOrdreUpdate
