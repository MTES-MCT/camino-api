const {
  titresDemarchesGet,
  titreDemarcheOrdreUpdate
} = require('../postgres/queries/titres-demarches')

const titreDemarchesSortAsc = require('./_utils/titre-demarches-sort-asc')

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
      const titreDemarchesOrdreChanged = titreDemarchesSortAsc(
        titresDemarchesGroupedByTitre[titreId]
      )
        .map((titreDemarche, index) => {
          titreDemarche.ordreUpdated = index + 1
          return titreDemarche
        })
        .filter(
          titreDemarche => titreDemarche.ordreUpdated !== titreDemarche.ordre
        )

      return titreDemarchesOrdreChanged.length
        ? [...res, ...titreDemarchesOrdreChanged]
        : res
    }, [])
    .map(titreDemarche => {
      return titreDemarcheOrdreUpdate({
        id: titreDemarche.id,
        ordre: titreDemarche.ordreUpdated
      }).then(u => {
        console.log(
          `Mise à jour: démarche ${titreDemarche.id}, ordre ${
            titreDemarche.ordreUpdated
          }`
        )
        return u
      })
    })

  await Promise.all([...titresDemarchesUpdated])

  return `Mise à jour: ${titresDemarchesUpdated.length} ordres de démarches.`
}

module.exports = titresDemarchesOrdreUpdate
