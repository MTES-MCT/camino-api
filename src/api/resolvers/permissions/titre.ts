import {
  IUtilisateur,
  IEntreprise,
  ITitre,
  IAdministration
} from '../../../types'

import autorisations from '../../../database/cache/autorisations'

import {
  permissionsCheck,
  permissionsAdministrationsCheck
} from './permissions-check'

const titreIsPublicCheck = (titre: ITitre) =>
  autorisations.domaines.find(
    d => d.domaineId === titre.domaineId && d.publicLecture
  ) &&
  autorisations.typesStatuts.find(
    t =>
      t.titreTypeId === titre.typeId &&
      t.titreStatutId === titre.statutId &&
      t.publicLecture
  )

const titrePermissionEntrepriseCheck = (
  user: IUtilisateur | undefined,
  titreAmodiataires: IEntreprise[] | undefined | null,
  titreTitulaires: IEntreprise[] | undefined | null,
  amodiatairePriority?: boolean
) => {
  // si l'utilisateur n'est pas dans le groupe 'entreprise'
  // le titre est inaccessible
  if (!permissionsCheck(user, ['entreprise'])) return false

  // sinon,
  // (l'utilisateur est dans le groupe 'entreprise')

  // si l'utilisateur est amodiataire,
  // le titre est accessible
  if (
    titreAmodiataires &&
    titreAmodiataires.some(t =>
      user?.entreprises?.find(({ id }) => id === t.id)
    )
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
  return !!(
    titreTitulaires &&
    titreTitulaires.some(t =>
      user?.entreprises?.find(({ id }) => id === t.id)
    ) &&
    (!amodiatairePriority ||
      !titreAmodiataires ||
      (titreAmodiataires && !titreAmodiataires.length))
  )
}

const titrePermissionCheck = (
  user: IUtilisateur | undefined,
  permissions: string[],
  titre: ITitre,
  amodiatairePriority?: boolean
) => {
  if (!user) return false

  // si l'utilisateur est un super admin
  // alors le titre est accessible
  if (permissionsCheck(user, ['super'])) return true

  // si l'utilisateur a les permissions
  // le titre est accessible
  if (permissionsCheck(user, permissions)) return true

  return titrePermissionEntrepriseCheck(
    user,
    titre.amodiataires,
    titre.titulaires,
    amodiatairePriority
  )
}

const titreActivitePermissionAdministrationsCheck = (
  user: IUtilisateur | undefined,
  administrations: IAdministration[] | undefined | null
) =>
  !!(
    permissionsCheck(user, ['admin', 'editeur']) &&
    administrations &&
    administrations.length &&
    permissionsAdministrationsCheck(
      user,
      administrations.map(({ id }) => id)
    )
  )

const titreActivitePermissionCheck = (
  user: IUtilisateur | undefined,
  titreAdministrations: IAdministration[] | undefined | null,
  titreAmodiataires: IEntreprise[] | undefined | null,
  titreTitulaires: IEntreprise[] | undefined | null
) =>
  permissionsCheck(user, ['super']) ||
  titreActivitePermissionAdministrationsCheck(user, titreAdministrations) ||
  titrePermissionEntrepriseCheck(user, titreAmodiataires, titreTitulaires)

export {
  titreIsPublicCheck,
  titrePermissionCheck,
  titreActivitePermissionCheck
}
