import {
  titreEtapeUpdate,
  titreEtapeCommuneInsert as titreEtapeCommuneInsertQuery,
  titreEtapeCommuneDelete as titreEtapeCommuneDeleteQuery
} from '../../database/queries/titres-etapes'

import titreEtapesAscSortByDate from '../utils/titre-etapes-asc-sort-by-date'

const titreEtapesOrdreUpdate = titreEtapes =>
  titreEtapesAscSortByDate(titreEtapes).reduce(
    (queries, titreEtape, index) =>
      titreEtape.ordre === index + 1
        ? queries
        : [
            ...queries,
            titreEtapeUpdate({
              id: titreEtape.id,
              props: { ordre: index + 1 }
            }).then(
              u =>
                `Mise à jour: étape ${titreEtape.id}, ${JSON.stringify({
                  ordre: index + 1
                })}`
            )
          ],
    []
  )

const titreEtapeCommunesInsert = (titreEtape, communesIds) =>
  communesIds.reduce(
    (queries, communeId) =>
      titreEtape.communes && titreEtape.communes.find(c => c.id === communeId)
        ? queries
        : [
            ...queries,
            titreEtapeCommuneInsertQuery({
              titreEtapeId: titreEtape.id,
              communeId
            }).then(
              u => `Mise à jour: étape ${titreEtape.id}, commune ${communeId}`
            )
          ],
    []
  )

const titreEtapeCommunesDelete = (titreEtape, communesIds) =>
  titreEtape.communes
    ? titreEtape.communes.reduce(
        (queries, commune) =>
          communesIds.find(communeId => communeId === commune.id)
            ? queries
            : [
                ...queries,
                titreEtapeCommuneDeleteQuery({
                  titreEtapeId: titreEtape.id,
                  communeId: commune.id
                }).then(
                  u =>
                    `Suppression: étape ${titreEtape.id}, commune ${commune.id}`
                )
              ],
        []
      )
    : []

export {
  titreEtapesOrdreUpdate,
  titreEtapeCommunesInsert,
  titreEtapeCommunesDelete
}
