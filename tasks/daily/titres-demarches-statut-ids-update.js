const { titreDemarcheStatutIdUpdate } = require('../titre-demarches')
const titreDemarcheStatutIdFind = require('../_utils/titre-demarche-statut-id-find')

// met à jour le statut des démarches
const titresDemarchesUpdate = async (titresDemarches, titres) => {
  const titresDemarchesUpdated = titresDemarches.reduce(
    (arr, titreDemarche) => {
      const titreTypeId =
        titres.find(t => t.id === titreDemarche.titreId).typeId
      const statutId = titreDemarcheStatutIdFind(titreDemarche, titreTypeId)

      const titreDemarcheUpdated = titreDemarcheStatutIdUpdate(
        titreDemarche,
        statutId
      )

      return titreDemarcheUpdated ? [...arr, titreDemarcheUpdated] : arr
    },
    []
  )

  await Promise.all(titresDemarchesUpdated)

  return `Mise à jour: ${titresDemarchesUpdated.length} statuts de démarches.`
}

module.exports = titresDemarchesUpdate
