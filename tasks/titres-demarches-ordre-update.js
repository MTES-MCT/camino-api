const {
  titresDemarches,
  titreDemarcheOrdreUpdate
} = require('../postgres/queries/titres-demarches')

const titreDemarcheOrdreFind = require('./_utils/titre-demarche-ordre-find')

const titresDemarchesOrdreUpdate = async () => {
  const tds = await titresDemarches({})

  const update = await Promise.all([
    ...tds.map(td =>
      titreDemarcheOrdreUpdate({
        id: td.id,
        ordre: titreDemarcheOrdreFind(td, tds)
      })
    )
  ])

  console.log('Mise à jour: ordre des démarches de tous les titres.')

  return update
}

module.exports = titresDemarchesOrdreUpdate
