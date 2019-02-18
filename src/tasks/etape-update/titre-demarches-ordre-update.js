import { titreDemarchesOrdreUpdate } from '../titre-demarches'

const titresDemarchesOrdreUpdate = async titresDemarchesByTitre => {
  const titreDemarchesOrdreUpdated = titreDemarchesOrdreUpdate(
    titresDemarchesByTitre
  )

  if (titreDemarchesOrdreUpdated) {
    const titreDemarcheOrdreUpdateQueries = titreDemarchesOrdreUpdated.map(q =>
      q.then(log => console.log(log))
    )
    await Promise.all(titreDemarcheOrdreUpdateQueries)
  }

  return `Mise à jour: ${
    titreDemarchesOrdreUpdated.length
  } ordres de démarches.`
}

export default titresDemarchesOrdreUpdate
