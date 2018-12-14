const {
  titreDemarcheStatutIdUpdate,
  titreDemarcheOrdreUpdate
} = require('../database/queries/titres-demarches')

const titreDemarchesAscSort = require('./_utils/titre-demarches-asc-sort')

const titreDemarches = {
  titreDemarcheStatutIdUpdate(titreDemarche, statutId) {
    return (
      // filtre uniquement les démarches dont le statut a changé
      statutId !== titreDemarche.statutId &&
      titreDemarcheStatutIdUpdate({
        id: titreDemarche.id,
        statutId
      }).then(u => {
        console.log(
          `Mise à jour: démarche ${titreDemarche.id}, statutId ${statutId}`
        )
        return u
      })
    )
  },

  titreDemarchesOrdreUpdate(titreDemarchesByTitre) {
    return titreDemarchesAscSort(titreDemarchesByTitre)
      .map((titreDemarche, index) => {
        titreDemarche.ordreUpdated = index + 1
        return titreDemarche
      })
      .filter(
        titreDemarche => titreDemarche.ordreUpdated !== titreDemarche.ordre
      )
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
  }
}

module.exports = titreDemarches
