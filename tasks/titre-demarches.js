const {
  titreDemarcheStatutIdUpdate,
  titreDemarcheOrdreUpdate
} = require('../postgres/queries/titres-demarches')

const titreDemarchesSortAsc = require('./_utils/titre-demarches-sort-asc')

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
    return titreDemarchesSortAsc(titreDemarchesByTitre)
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
