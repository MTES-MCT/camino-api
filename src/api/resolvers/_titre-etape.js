import { permissionsAdministrationsCheck } from './_permissions-check'
import restrictions from './_restrictions'

const titreEtapeEditionPermissionAdministrationsCheck = (
  titreEtape,
  titre,
  user,
  editionMode
) => {
  // dans un premier temps, on ne vérifie la création que pour les ARM
  if (titre.typeId !== 'arm') return false

  const {
    administrationsCentrales: titreAdministrationsCentrales = [],
    administrationsLocales: titreAdministrationsLocales = []
  } = titre

  const titreAdministrations = [
    ...titreAdministrationsCentrales,
    ...titreAdministrationsLocales
  ]

  // filtre les restrictions pour ne garder que celles qui concernent le titre
  const titreEtapeRestrictions = restrictions.etapesTypesAdministrations.filter(
    restriction =>
      restriction.etapeTypeId === titreEtape.typeId &&
      restriction[`${editionMode}Interdit`]
  )

  // filtre les administration qui font l'objet d'une restriction
  const titreAdministrationsEditionIds = titreAdministrations.reduce(
    (titreAdministrationsEditionIds, a) => {
      if (!titreEtapeRestrictions.find(r => r.administrationId === a.id)) {
        titreAdministrationsEditionIds.push(a.id)
      }

      return titreAdministrationsEditionIds
    },
    []
  )

  // - si l'utilisateur a les droits de création sur le domaine/type de titre
  return permissionsAdministrationsCheck(user, titreAdministrationsEditionIds)
}

export { titreEtapeEditionPermissionAdministrationsCheck }
