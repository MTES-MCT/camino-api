import { titreDemarchesOrdreUpdate } from '../titre-demarches'

const titresDemarchesOrdreUpdate = async titresDemarchesByTitre => {
  const titreDemarchesOrdreUpdated = titreDemarchesOrdreUpdate(
    titresDemarchesByTitre
  )

  await Promise.all(titreDemarchesOrdreUpdated)

  return `Mise à jour: ${
    titreDemarchesOrdreUpdated.length
  } ordres de démarches.`
}

export default titresDemarchesOrdreUpdate
