const { titreDemarcheStatutIdUpdate } = require('../titre-demarches')
const titreDemarcheStatutIdFind = require('../_utils/titre-demarche-statut-id-find')

// met à jour le statut des démarches
const titresDemarchesUpdate = async (titreDemarche, titreTypeId) => {
  const statutId = titreDemarcheStatutIdFind(titreDemarche, titreTypeId)

  const titreDemarcheUpdated = titreDemarcheStatutIdUpdate(
    titreDemarche,
    statutId
  )

  if (titreDemarcheUpdated) {
    await titreDemarcheUpdated
  }

  return `Mise à jour: ${titreDemarcheUpdated ? '1' : '0'} statut de démarches.`
}

module.exports = titresDemarchesUpdate
