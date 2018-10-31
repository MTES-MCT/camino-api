const { titreDemarcheGet } = require('../../postgres/queries/titres-demarches')
const { titreGet } = require('../../postgres/queries/titres')
const { titreDemarcheStatutIdUpdate } = require('../titre-demarches')
const titreDemarcheStatutIdFind = require('../_utils/titre-demarche-statut-id-find')

// met à jour le statut des démarches
const titresDemarchesUpdate = async titreDemarcheId => {
  const titreDemarche = await titreDemarcheGet(titreDemarcheId)
  const titre = await titreGet(titreDemarche.titreId)

  const titreIsAxm = titre.typeId === 'axm'
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
