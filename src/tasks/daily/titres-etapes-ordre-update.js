const { titreEtapesOrdreUpdate } = require('../titre-etapes')

const titresEtapesOrdreUpdate = async titresEtapes => {
  const titreEtapesByDemarches = titreEtapesByDemarchesGroup(titresEtapes)

  const titresEtapesUpdated = Object.keys(titreEtapesByDemarches).reduce(
    (arr, titreDemarche) => [
      ...arr,
      ...titreEtapesOrdreUpdate(titreEtapesByDemarches[titreDemarche])
    ],
    []
  )

  await Promise.all(titresEtapesUpdated)

  return `Mise à jour: ${titresEtapesUpdated.length} ordres d'étapes.`
}

// retourne les étapes classées par démarche
const titreEtapesByDemarchesGroup = titresEtapes =>
  titresEtapes.reduce((titreEtapesByDemarches, titreEtape) => {
    titreEtapesByDemarches[titreEtape.titreDemarcheId] = titreEtapesByDemarches[
      titreEtape.titreDemarcheId
    ]
      ? [...titreEtapesByDemarches[titreEtape.titreDemarcheId], titreEtape]
      : [titreEtape]
    return titreEtapesByDemarches
  }, {})

module.exports = titresEtapesOrdreUpdate
