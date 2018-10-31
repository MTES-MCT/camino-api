const {
  titresDemarchesGet
} = require('../../postgres/queries/titres-demarches')

const { titreDemarchesOrdreUpdate } = require('../titre-demarches')

const titresDemarchesOrdreUpdate = async () => {
  const titresDemarches = await titresDemarchesGet({})
  const titresDemarchesByTitre = titresDemarchesByTitreGroup(titresDemarches)
  const titresDemarchesUpdated = Object.keys(titresDemarchesByTitre).reduce(
    (res, titreId) => {
      const titreDemarchesOrdreUpdated = titreDemarchesOrdreUpdate(
        titresDemarchesByTitre[titreId]
      )

      return [...res, ...titreDemarchesOrdreUpdated]
    },
    []
  )

  await Promise.all(titresDemarchesUpdated)

  return `Mise à jour: ${titresDemarchesUpdated.length} ordres de démarches.`
}

const titresDemarchesByTitreGroup = titresDemarches =>
  titresDemarches.reduce((res, titreDemarche) => {
    res[titreDemarche.titreId] = res[titreDemarche.titreId]
      ? [...res[titreDemarche.titreId], titreDemarche]
      : [titreDemarche]

    return res
  }, {})

module.exports = titresDemarchesOrdreUpdate
