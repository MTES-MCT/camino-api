import titreAdministrationsGestionnairesBuild from '../../../business/rules/titre-administrations-gestionnaires-build'

import {
  permissionsCheck,
  permissionsAdministrationsCheck
} from './permissions-check'
import restrictions from '../_restrictions'

const titreIsPublicCheck = titre =>
  !restrictions.domaines.find(
    d => d.domaineId === titre.domaineId && d.publicLectureInterdit
  ) &&
  !restrictions.typesStatuts.find(
    t =>
      t.typeId === titre.typeId &&
      t.statutId === titre.statutId &&
      t.publicLectureInterdit
  )

const titreEntreprisePermissionCheck = (
  user,
  titreAmodiataires,
  titreTitulaires,
  amodiatairePriority
) => {
  // si l'utilisateur n'est pas dans le groupe 'entreprise'
  // le titre est inaccessible
  if (!permissionsCheck(user, ['entreprise'])) {
    return false
  }

  // sinon,
  // (l'utilisateur est dans le groupe 'entreprise')

  // si l'utilisateur est amodiataire,
  // le titre est accessible
  if (
    titreAmodiataires &&
    titreAmodiataires.some(t => user.entreprises.find(({ id }) => id === t.id))
  ) {
    return true
  }

  // si
  // - l'utilisateur est titulaire
  // - et si
  //   - la condition 'amodiatairePriority' est FALSE
  //   - ou il n'y a aucun amodiataire
  // le titre est accessible
  // sinon le titre est inaccessible
  return (
    titreTitulaires &&
    titreTitulaires.some(t => user.entreprises.find(({ id }) => id === t.id)) &&
    (!amodiatairePriority || !titreAmodiataires.length)
  )
}

const titrePermissionCheck = (
  titre,
  user,
  permissions,
  amodiatairePriority
) => {
  if (!user) {
    return false
  }

  // si l'utilisateur est un super admin
  // alors le titre est accessible
  if (permissionsCheck(user, ['super'])) {
    return true
  }

  // si l'utilisateur a les permissions
  // le titre est accessible
  if (permissionsCheck(user, permissions)) {
    return true
  }

  return titreEntreprisePermissionCheck(
    user,
    titre.amodiataires,
    titre.titulaires,
    amodiatairePriority
  )
}

const titrePermissionAdministrationsCheck = (titre, user) =>
  ((titre.administrationsGestionnaires &&
    titre.administrationsGestionnaires.length) ||
    (titre.administrationsLocales && titre.administrationsLocales.length)) &&
  permissionsAdministrationsCheck(user, [
    ...titre.administrationsLocales.map(a => a.id),
    ...titre.administrationsGestionnaires.map(a => a.id)
  ])

const titreEditionPermissionAdministrationsCheck = (
  editionMode,
  titre,
  user,
  administrations
) => {
  // dans un premier temps, on ne vérifie l'édition que pour les ARM et les AEX
  if (!['arm', 'axm'].includes(titre.typeId)) return false

  const titreAdministrationsGestionnaires =
    titre.administrationsGestionnaires &&
    titre.administrationsGestionnaires.length
      ? titre.administrationsGestionnaires
      : // calcule les administrations gestionnaires pour le titre
        // si elles n'existent pas encore (création de titre)
        titreAdministrationsGestionnairesBuild(titre, administrations).map(
          a => ({
            id: a.administrationId
          })
        )

  const { administrationsLocales: titreAdministrationsLocales = [] } = titre

  const titreAdministrations = [
    ...titreAdministrationsGestionnaires,
    ...titreAdministrationsLocales
  ]

  if (!titreAdministrations.length) return false

  // filtre les restrictions pour ne garder que celles qui concernent le titre
  const titreRestrictions = restrictions.typesStatutsAdministrations.filter(
    restriction =>
      restriction.typeId === titre.typeId &&
      // si le titre n'a pas de statut, c'est qu'il est en train d'être créé
      restriction.statutId === (titre.statutId || 'dmi') &&
      restriction[`${editionMode}Interdit`]
  )

  // filtre les administration qui font l'objet d'une restriction
  const titreEditionAdministrationsIds = titreAdministrations.reduce(
    (titreEditionAdministrationsIds, ac) => {
      if (!titreRestrictions.find(r => r.administrationId === ac.id)) {
        titreEditionAdministrationsIds.push(ac.id)
      }

      return titreEditionAdministrationsIds
    },
    []
  )

  // - si l'utilisateur a les droits de création sur le domaine/type de titre
  return permissionsAdministrationsCheck(user, titreEditionAdministrationsIds)
}

const titreActivitePermissionAdministrationCheck = (user, titreActiviteType) =>
  permissionsCheck(user, ['admin', 'editeur']) &&
  permissionsAdministrationsCheck(
    user,
    titreActiviteType.administrations.map(({ id }) => id)
  )

const titreActivitePermissionCheck = (
  user,
  titreActivite,
  titreAmodiataires,
  titreTitulaires
) =>
  permissionsCheck(user, ['super']) ||
  titreActivitePermissionAdministrationCheck(user, titreActivite.type) ||
  titreEntreprisePermissionCheck(user, titreAmodiataires, titreTitulaires)

const titreCreationPermissionAdministrationsCheck = (...args) =>
  titreEditionPermissionAdministrationsCheck('creation', ...args)

const titreModificationPermissionAdministrationsCheck = (...args) =>
  titreEditionPermissionAdministrationsCheck('modification', ...args)

export {
  titreIsPublicCheck,
  titrePermissionCheck,
  titrePermissionAdministrationsCheck,
  titreCreationPermissionAdministrationsCheck,
  titreModificationPermissionAdministrationsCheck,
  titreActivitePermissionCheck
}
