import {
  permissionsCheck,
  permissionsAdministrationsCheck
} from './_permissions-check'
import restrictions from './_restrictions'

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
    titre.amodiataires &&
    titre.amodiataires.some(t => user.entreprises.find(({ id }) => id === t.id))
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
    titre.titulaires &&
    titre.titulaires.some(t =>
      user.entreprises.find(({ id }) => id === t.id)
    ) &&
    (!amodiatairePriority || !titre.amodiataires.length)
  )
}

const titrePermissionAdministrationsCheck = (titre, user) =>
  ((titre.administrationsCentrales && titre.administrationsCentrales.length) ||
    (titre.administrationsLocales && titre.administrationsLocales.length)) &&
  permissionsAdministrationsCheck(user, [
    ...titre.administrationsLocales.map(a => a.id),
    ...titre.administrationsCentrales.map(a => a.id)
  ])

export {
  titreIsPublicCheck,
  titrePermissionCheck,
  titrePermissionAdministrationsCheck
}
