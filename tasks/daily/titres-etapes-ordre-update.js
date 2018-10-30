const { titresEtapesGet } = require('../../postgres/queries/titres-etapes')

const titreEtapeUpdate = require('../titre-etape-update')

const titresEtapesOrdreUpdate = async () => {
  const titresEtapes = await titresEtapesGet({})

  const titreEtapesByDemarches = titreEtapesByDemarchesGroup(titresEtapes)

  const titresEtapesUpdated = Object.keys(titreEtapesByDemarches)
    .reduce(
      (arr, titreDemarche) => [
        ...arr,
        ...titreEtapesByDemarches[titreDemarche]
          .sort((a, b) => a.date - b.date)
          .map((titreEtape, index) => {
            titreEtape.ordreNew = index + 1
            return titreEtape
          })
      ],
      []
    )
    .filter(titreEtape => titreEtape.ordreNew !== titreEtape.ordre)
    .map(titreEtape => {
      const props = {
        ordre: titreEtape.ordreNew
      }

      titreEtapeUpdate(titreEtape.id, props)
    })

  await Promise.all([...titresEtapesUpdated])

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
