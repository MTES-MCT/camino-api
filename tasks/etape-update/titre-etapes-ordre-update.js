const { titresEtapesGet } = require('../../postgres/queries/titres-etapes')
const { titreEtapesOrdreUpdate } = require('../titre-etapes')

const titresEtapesOrdreUpdate = async titreDemarcheId => {
  const titresEtapesByDemarche = await titresEtapesGet({
    titresDemarchesIds: [titreDemarcheId],
    etapesIds: null
  })

  const titresEtapesUpdated = titreEtapesOrdreUpdate(titresEtapesByDemarche)

  await Promise.all(titresEtapesUpdated)

  return `Mise à jour: ${titresEtapesUpdated.length} ordres d'étapes.`
}

module.exports = titresEtapesOrdreUpdate
