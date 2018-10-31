const { titreDemarcheGet } = require('../../postgres/queries/titres-demarches')

const { titreDemarchesOrdreUpdate } = require('../titre-demarches')

const titresDemarchesOrdreUpdate = async titreDemarcheId => {
  const titresDemarchesByTitre = await titreDemarcheGet(titreDemarcheId)

  const titreDemarchesOrdreUpdated = titreDemarchesOrdreUpdate(
    titresDemarchesByTitre
  )

  await Promise.all(titreDemarchesOrdreUpdated)

  return `Mise à jour: ${
    titreDemarchesOrdreUpdated.length
  } ordres de démarches.`
}

module.exports = titresDemarchesOrdreUpdate
