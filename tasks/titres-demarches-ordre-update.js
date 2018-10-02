const {
  titresDemarchesGet,
  titreDemarcheOrdreUpdate
} = require('../postgres/queries/titres-demarches')

const titreDemarchesSortAsc = require('./_utils/titre-demarches-sort-asc')
const titreDemarcheOrdreFind = require('./_utils/titre-demarche-ordre-find')

const titresDemarchesOrdreUpdate = async () => {
  const titresDemarches = await titresDemarchesGet({})

  const titresDemarchesGroupedByTitre = titresDemarches.reduce(
    (res, titreDemarche) => {
      res[titreDemarche.titreId] = res[titreDemarche.titreId]
        ? [...res[titreDemarche.titreId], titreDemarche]
        : [titreDemarche]

      return res
    },
    {}
  )

  const titresDemarchesUpdated = Object.keys(titresDemarchesGroupedByTitre)
    .reduce((res, titreId) => {
      const titreDemarchesOrdreChanged = titreDemarchesOrdreChangedFilter(
        titresDemarchesGroupedByTitre[titreId]
      )

      return titreDemarchesOrdreChanged.length
        ? [...res, ...titreDemarchesOrdreChanged]
        : res
    }, [])
    .map(titreDemarche => {
      const ordre = titreDemarcheOrdreFind(
        titreDemarche.id,
        titresDemarchesGroupedByTitre[titreDemarche.titreId]
      )

      return titreDemarcheOrdreUpdate({
        id: titreDemarche.id,
        ordre
      }).then(u => {
        console.log(`Mise à jour: démarche ${titreDemarche.id}, ordre ${ordre}`)
        return u
      })
    })

  await Promise.all([...titresDemarchesUpdated])

  return `Mise à jour: ${titresDemarchesUpdated.length} ordres de démarches.`
}

const titreDemarchesOrdreChangedFilter = titreDemarches =>
  titreDemarchesSortAsc(titreDemarches).filter(
    (td, index) => index + 1 !== td.ordre
  )

module.exports = titresDemarchesOrdreUpdate
