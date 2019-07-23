import {
  titreEtapeUpdate as titreEtapeUpdateQuery,
  titreEtapesCommunesCreate as titreEtapesCommunesCreateQuery,
  titreEtapeCommuneDelete as titreEtapeCommuneDeleteQuery,
  titreEtapesAdministrationsCreate as titreEtapesAdministrationsCreateQuery,
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

const titresEtapesAdministrationsCreate = async titreEtapesAdministrations => {
  await titreEtapesAdministrationsCreateQuery(titreEtapesAdministrations)

  return `Mise à jour: étape administrations ${titreEtapesAdministrations
    .map(tea => JSON.stringify(tea))
    .join(', ')}`
}

const titreEtapeAdministrationDelete = async (
  titreEtapeId,
  administrationId
) => {
  await titreEtapeAdministrationDeleteQuery(titreEtapeId, administrationId)

  return `Suppression: étape ${titreEtapeId}, administration ${administrationId}`
}

export {
  titreEtapeUpdate,
  titreEtapesCommunesCreate,
  titreEtapeCommuneDelete,
  titresEtapesAdministrationsCreate,
  titreEtapeAdministrationDelete,
  titreEtapesIdsUpdate
}
