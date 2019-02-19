import { titreEtapesOrdreUpdate } from '../titre-etapes'

const titresEtapesOrdreUpdate = async titreDemarche => {
  const titresEtapesUpdated = titreEtapesOrdreUpdate(titreDemarche.etapes)

  if (titresEtapesUpdated && titresEtapesUpdated.length) {
    await Promise.all(titresEtapesUpdated)
  }

  return `Mise à jour: ${titresEtapesUpdated.length} ordres d'étapes.`
}

export default titresEtapesOrdreUpdate
