import {
  IUtilisateur,
  IEntreprise,
  ITitre,
  IAdministration
} from '../../../types'

import {
  permissionsCheck,
  permissionsAdministrationsCheck
} from './permissions-check'
import restrictions from '../../../database/cache/restrictions'

type ModeName = 'creationInterdit' | 'modificationInterdit'

const titreIsPublicCheck = (titre: ITitre) =>
  !restrictions.domaines.find(
    d => d.domaineId === titre.domaineId && d.publicLectureInterdit
  ) &&
  !restrictions.typesStatuts.find(
    t =>
      t.titreTypeId === titre.typeId &&
      t.titreStatutId === titre.statutId &&
      t.publicLectureInterdit
  )

const titrePermissionEntrepriseCheck = (
  user: IUtilisateur | undefined,
  titreAmodiataires?: IEntreprise[],
  titreTitulaires?: IEntreprise[],
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

const titreEditionAdministrationsIdsFind = (
  mode: 'modification' | 'creation',
  titreTypeId: string,
  titreStatutId?: string,
  titreAdministrationsGestionnaires?: IAdministration[],
  titreAdministrationsLocales?: IAdministration[]
) => {
  const titreAdministrations = []

  if (
    titreAdministrationsGestionnaires &&
    titreAdministrationsGestionnaires.length
  ) {
    titreAdministrations.push(...titreAdministrationsGestionnaires)
  }

  if (titreAdministrationsLocales && titreAdministrationsLocales.length) {
    titreAdministrations.push(...titreAdministrationsLocales)
  }

  // filtre les restrictions pour ne garder que celles qui concernent le titre
  const titreRestrictions = restrictions.typesStatutsAdministrations.filter(
    restriction =>
      restriction.titreTypeId === titreTypeId &&
      restriction.titreStatutId === titreStatutId &&
      restriction[`${mode}Interdit` as ModeName]
  )

  return titreAdministrations.reduce(
    (titreEditionAdministrationsIds: string[], ac) => {
      if (!titreRestrictions.find(r => r.administrationId === ac.id)) {
        titreEditionAdministrationsIds.push(ac.id)
      }

      return titreEditionAdministrationsIds
    },
    []
  )
}

const titrePermissionAdministrationsCheck = (
  user: IUtilisateur | undefined,
  mode: 'modification' | 'creation',
  titreTypeId: string,
  titreStatutId: string,
  titreAdministrationsGestionnaires?: IAdministration[],
  titreAdministrationsLocales?: IAdministration[]
) => {
  // actuellement, on ne peut éditer que pour les ARM et les AEX
  if (!['arm', 'axm'].includes(titreTypeId)) return false

  const titreEditionAdministrationsIds = titreEditionAdministrationsIdsFind(
    mode,
    titreTypeId,
    titreStatutId,
    titreAdministrationsGestionnaires,
    titreAdministrationsLocales
  )

  // - si l'utilisateur a les droits de création sur le domaine/type de titre
  return permissionsAdministrationsCheck(user, titreEditionAdministrationsIds)
}

const titreActivitePermissionAdministrationsCheck = (
  user: IUtilisateur | undefined,
  administrations?: IAdministration[]
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
  titreAdministrations?: IAdministration[],
  titreAmodiataires?: IEntreprise[],
  titreTitulaires?: IEntreprise[]
) =>
  permissionsCheck(user, ['super']) ||
  titreActivitePermissionAdministrationsCheck(user, titreAdministrations) ||
  titrePermissionEntrepriseCheck(user, titreAmodiataires, titreTitulaires)

export {
  titreIsPublicCheck,
  titrePermissionCheck,
  titreActivitePermissionCheck,
  titrePermissionAdministrationsCheck
}
