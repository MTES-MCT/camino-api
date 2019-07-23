import {
  titreEtapeUpdate as titreEtapeUpdateQuery,
  titreEtapesCommunesCreate as titreEtapesCommunesCreateQuery,
  titreEtapeCommuneDelete as titreEtapeCommuneDeleteQuery,
  titreEtapeAdministrationInsert as titreEtapeAdministrationInsertQuery,
  titreEtapeAdministrationDelete as titreEtapeAdministrationDeleteQuery,
  titreEtapesIdsUpdate
} from '../../database/queries/titres-etapes'

const titreEtapeUpdate = async (titreEtapeId, props) => {
  await titreEtapeUpdateQuery(titreEtapeId, props)

  return `Mise à jour: étape ${titreEtapeId}, ${JSON.stringify(props)}`
}

const titreEtapesCommunesCreate = async titreEtapesCommunes => {
  await titreEtapesCommunesCreateQuery(titreEtapesCommunes)

  return `Mise à jour: étape communes ${titreEtapesCommunes
    .map(tec => JSON.stringify(tec))
    .join(', ')}`
}

const titreEtapeCommuneDelete = async (titreEtapeId, communeId) => {
  await titreEtapeCommuneDeleteQuery(titreEtapeId, communeId)

  return `Suppression: étape ${titreEtapeId}, commune ${communeId}`
}

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
  titreEtapeUpdate,
  titreEtapesCommunesCreate,
  titreEtapeCommuneDelete,
  titreEtapeAdministrationsInsert,
  titreEtapeAdministrationsDelete,
  titreEtapesIdsUpdate
}
