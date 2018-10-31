const { titreDemarcheStatutIdUpdate } = require('../titre-demarches')
const titreDemarcheStatutIdFind = require('../_utils/titre-demarche-statut-id-find')

// met à jour le statut des démarches
const titresDemarchesUpdate = async (titreDemarche, titreIsAxm) => {
  const statutId = titreDemarcheStatutIdFind(titreDemarche, titreIsAxm)

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
