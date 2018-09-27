const {
  titresDemarchesGet,
  titreDemarcheOrdreUpdate
} = require('../postgres/queries/titres-demarches')

const titreDemarcheOrdreFind = require('./_utils/titre-demarche-ordre-find')

const titresDemarchesOrdreUpdate = async () => {
  const titresDemarches = await titresDemarchesGet({})

  const titresDemarchesUpdated = titresDemarches.reduce(
    (arr, titreDemarche) => {
      // démarches appartenant au même titre
      const titreDemarches = titreDemarchesByTitreFind(
        titresDemarches,
        titreDemarche.titreId
      )

      const ordre = titreDemarcheOrdreFind(titreDemarche, titreDemarches)

      if (ordre !== titreDemarche.ordre) {
        const titreDemarcheUdpate = titreDemarcheOrdreUpdate({
          id: titreDemarche.id,
          ordre
        }).then(u => {
          console.log(
            `Mise à jour: démarche ${titreDemarche.id}, ordre ${ordre}`
          )
          return u
        })

        arr = [...arr, titreDemarcheUdpate]
      }

      return arr
    },
    []
  )

  await Promise.all([...titresDemarchesUpdated])

  return `Mise à jour: ${titresDemarchesUpdated.length} ordres de démarches.`
}

// retourne les démarches appartenant au même titre
const titreDemarchesByTitreFind = (titresDemarches, titreId) =>
  titresDemarches.filter(titreDemarche => titreDemarche.titreId === titreId)

module.exports = titresDemarchesOrdreUpdate
