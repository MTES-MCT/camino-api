const {
  titresDemarches,
  titreDemarcheOrdreUpdate
} = require('../postgres/queries/titres-demarches')

const titreDemarcheOrdreFind = require('./_utils/titre-demarche-ordre-find')

const titresDemarchesOrdreUpdate = async () => {
  const tds = await titresDemarches({})
  const tdsModified = tds.filter(
    td => titreDemarcheOrdreFind(td, tds) !== td.ordre
  )

  const update = await Promise.all([
    ...tdsModified.map(async td => {
      const ordre = titreDemarcheOrdreFind(td, tds)
      const titreDemarche = await titreDemarcheOrdreUpdate({
        id: td.id,
        ordre
      })
      console.log(`Mise à jour: démarche ${td.id}, ordre ${ordre}`)

      return titreDemarche
    })
  ])

  console.log(
    `Mise à jour: ordre de ${tdsModified.length} démarches de titres.`
  )

  return update
}

module.exports = titresDemarchesOrdreUpdate
