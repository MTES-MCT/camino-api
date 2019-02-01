import {
  titreDemarcheStatutIdUpdate as queryTitreDemarcheStatutIdUpdate,
  titreDemarcheOrdreUpdate as queryTitreDemarcheOrdreUpdate
} from '../database/queries/titres-demarches'

import titreDemarchesAscSort from './_utils/titre-demarches-asc-sort'

// met à jour le statut d'une démarche
const titreDemarcheStatutIdUpdate = (titreDemarche, statutId) =>
  // filtre uniquement les démarches dont le statut a changé
  statutId !== titreDemarche.statutId &&
  queryTitreDemarcheStatutIdUpdate({
    id: titreDemarche.id,
    statutId
  }).then(u => {
    console.log(
      `Mise à jour: démarche ${titreDemarche.id}, statutId ${statutId}`
    )
    return u
  })

// met à jour la propriété 'ordre' de toutes les démarches d'un titre
const titreDemarchesOrdreUpdate = titreDemarchesByTitre =>
  titreDemarchesAscSort(titreDemarchesByTitre)
    // to-do: faire un reduce au lieu de map-filter-map
    .map((titreDemarche, index) => {
      titreDemarche.ordreUpdated = index + 1
      return titreDemarche
    })
    .filter(titreDemarche => titreDemarche.ordreUpdated !== titreDemarche.ordre)
    .map(titreDemarche => {
      return queryTitreDemarcheOrdreUpdate({
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

export { titreDemarcheStatutIdUpdate, titreDemarchesOrdreUpdate }
