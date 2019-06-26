import {
  titreDemarcheStatutIdUpdate as queryTitreDemarcheStatutIdUpdate,
  titreDemarcheOrdreUpdate as queryTitreDemarcheOrdreUpdate,
  titreDemarchesIdsUpdate
} from '../../database/queries/titres-demarches'

import titreDemarchesAscSort from '../utils/titre-demarches-asc-sort'

// met à jour le statut d'une démarche
const titreDemarcheStatutIdUpdate = (titreDemarche, statutId) =>
  // filtre uniquement les démarches dont le statut a changé
  statutId !== titreDemarche.statutId &&
  queryTitreDemarcheStatutIdUpdate({
    id: titreDemarche.id,
    statutId
  }).then(
    u => `Mise à jour: démarche ${titreDemarche.id}, statutId ${statutId}`
  )

// met à jour la propriété 'ordre' de toutes les démarches d'un titre
const titreDemarchesOrdreUpdate = titreDemarches =>
  titreDemarchesAscSort(titreDemarches).reduce(
    (acc, titreDemarche, index) =>
      titreDemarche.ordre === index + 1
        ? acc
        : [
            ...acc,
            queryTitreDemarcheOrdreUpdate({
              id: titreDemarche.id,
              ordre: index + 1
            }).then(
              u =>
                `Mise à jour: démarche ${titreDemarche.id}, ordre ${index + 1}`
            )
          ],
    []
  )

export {
  titreDemarcheStatutIdUpdate,
  titreDemarchesOrdreUpdate,
  titreDemarchesIdsUpdate
}
