import {
  permissionsCheck,
  permissionsAdministrationsCheck
} from './_permissions-check'
import {
  restrictedDomaineIds,
  restrictedTypeIds,
  restrictedStatutIds
} from './_restrictions'

const titreIsPublicCheck = ({ domaineId, typeId, statutId }) =>
  !restrictedDomaineIds.includes(domaineId) &&
  !restrictedTypeIds.includes(typeId) &&
  !restrictedStatutIds.includes(statutId)

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

  // si le titre est de type ARM
  // alors, si l'utilisateursest rattaché à l'ONF de Guyane
  // alors le titre est accessible
  // sinon le titre est inaccessible
  if (titre.typeId === 'arm') {
    return permissionsAdministrationsCheck(user, ['ope-onf-973-01'])
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
    titre.titulaires.some(t =>
      user.entreprises.find(({ id }) => id === t.id)
    ) &&
    (!amodiatairePriority || !titre.amodiataires.length)
  )
}

const titrePermissionAdministrationsCheck = (user, administrations) =>
  permissionsAdministrationsCheck(user, administrations)

export {
  titreIsPublicCheck,
  titrePermissionCheck,
  titrePermissionAdministrationsCheck
}
