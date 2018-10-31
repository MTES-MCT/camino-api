const {
  titresDemarchesGet
} = require('../../postgres/queries/titres-demarches')

const { titresGet } = require('../../postgres/queries/titres')

const { titreDemarcheStatutIdUpdate } = require('../titre-demarches')
const titreDemarcheStatutIdFind = require('../_utils/titre-demarche-statut-id-find')

// met à jour le statut des démarches
const titresDemarchesUpdate = async () => {
  const titresDemarches = await titresDemarchesGet({})
  const titres = await titresGet({})

  const titresDemarchesUpdated = titresDemarches.reduce(
    (arr, titreDemarche) => {
      const titreIsAxm =
        titres.find(t => t.id === titreDemarche.titreId).typeId === 'axm'
      const statutId = titreDemarcheStatutIdFind(titreDemarche, titreIsAxm)

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
