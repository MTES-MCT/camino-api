import {
  titreEtapeUpdate,
  titreEtapeCommuneInsert as titreEtapeCommuneInsertQuery,
  titreEtapeCommuneDelete as titreEtapeCommuneDeleteQuery,
  titreEtapeAdministrationInsert as titreEtapeAdministrationInsertQuery,
  titreEtapeAdministrationDelete as titreEtapeAdministrationDeleteQuery,
  titreEtapesIdsUpdate
} from '../../database/queries/titres-etapes'

import titreEtapesAscSortByDate from '../utils/titre-etapes-asc-sort-by-date'

const titreEtapesOrdreUpdate = titreEtapes =>
  titreEtapesAscSortByDate(titreEtapes).reduce(
    (queries, titreEtape, index) =>
      titreEtape.ordre === index + 1
        ? queries
        : [
            ...queries,
            titreEtapeUpdate(titreEtape.id, { ordre: index + 1 }).then(
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

const titreEtapeAdministrationsInsert = (titreEtape, administrationsIds) =>
  administrationsIds.reduce(
    (queries, administrationId) =>
      titreEtape.administrations &&
      titreEtape.administrations.find(c => c.id === administrationId)
        ? queries
        : [
            ...queries,
            titreEtapeAdministrationInsertQuery({
              titreEtapeId: titreEtape.id,
              administrationId
            }).then(
              u =>
                `Mise à jour: étape ${titreEtape.id}, administration ${administrationId}`
            )
          ],
    []
  )

const titreEtapeAdministrationsDelete = (titreEtape, administrationsIds) =>
  titreEtape.administrations
    ? titreEtape.administrations.reduce(
        (queries, administration) =>
          administrationsIds.find(
            administrationId => administrationId === administration.id
          )
            ? queries
            : [
                ...queries,
                titreEtapeAdministrationDeleteQuery({
                  titreEtapeId: titreEtape.id,
                  administrationId: administration.id
                }).then(
                  u =>
                    `Suppression: étape ${titreEtape.id}, administration ${administration.id}`
                )
              ],
        []
      )
    : []

export {
  titreEtapesOrdreUpdate,
  titreEtapeCommunesInsert,
  titreEtapeCommunesDelete,
  titreEtapeAdministrationsInsert,
  titreEtapeAdministrationsDelete,
  titreEtapesIdsUpdate
}
