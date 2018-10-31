const { titreEtapesOrdreUpdate } = require('../titre-etapes')

const titresEtapesOrdreUpdate = async titreDemarche => {
  const titresEtapesUpdated = titreEtapesOrdreUpdate(titreDemarche.etapes)

  await Promise.all(titresEtapesUpdated)

  return `Mise à jour: ${titresEtapesUpdated.length} ordres d'étapes.`
}

module.exports = titresEtapesOrdreUpdate
