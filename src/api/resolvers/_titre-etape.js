import { permissionsAdministrationsCheck } from './_permissions-check'
import restrictions from './_restrictions'

const titreEtapeEditionPermissionAdministrationsCheck = (
  editionMode,
  titreEtapeTypeId,
  titre,
  user
) => {
  // dans un premier temps, on ne vérifie l'édition que pour les ARM
  if (titre.typeId !== 'arm') return false

  const {
    administrationsGestionnaires: titreAdministrationsGestionnaires = [],
    administrationsLocales: titreAdministrationsLocales = []
  } = titre

  const titreAdministrations = [
    ...titreAdministrationsGestionnaires,
    ...titreAdministrationsLocales
  ]

  // filtre les restrictions pour ne garder que celles qui concernent le titre
  const titreEtapeRestrictions = restrictions.etapesTypesAdministrations.filter(
    restriction =>
      restriction.etapeTypeId === titreEtapeTypeId &&
      restriction[`${editionMode}Interdit`]
  )

  // filtre les administration qui font l'objet d'une restriction
  const titreEtapeEditionAdministrationsIds = titreAdministrations.reduce(
    (titreEtapeEditionAdministrationsIds, a) => {
      if (!titreEtapeRestrictions.find(r => r.administrationId === a.id)) {
        titreEtapeEditionAdministrationsIds.push(a.id)
      }

      return titreEtapeEditionAdministrationsIds
    },
    []
  )

  // - si l'utilisateur a les droits d'édition sur le domaine/type de titre
  return permissionsAdministrationsCheck(
    user,
    titreEtapeEditionAdministrationsIds
  )
}

const titreEtapeCreationPermissionAdministrationsCheck = (...args) =>
  titreEtapeEditionPermissionAdministrationsCheck('edition', ...args)

const titreEtapeModificationPermissionAdministrationsCheck = (...args) =>
  titreEtapeEditionPermissionAdministrationsCheck('modification', ...args)

export {
  titreEtapeCreationPermissionAdministrationsCheck,
  titreEtapeModificationPermissionAdministrationsCheck
}
