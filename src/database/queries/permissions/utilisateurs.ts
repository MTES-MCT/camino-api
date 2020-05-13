import { IUtilisateur } from '../../../types'

import { raw, QueryBuilder } from 'objection'
import { permissionCheck } from '../../../tools/permission'
import Utilisateurs from '../../models/utilisateurs'

import Administrations from '../../models/administrations'
import Entreprises from '../../models/entreprises'

const utilisateursPermissionQueryBuild = (
  q: QueryBuilder<Utilisateurs, Utilisateurs | Utilisateurs[]>,
  user?: IUtilisateur,
  rootTable = true
) => {
  // Si la requête est utilisée sur une autre table que la table de base, il n'est pas forcément utile de sélectionner les éléments de la table de base
  if (rootTable) {
    q.select('utilisateurs.*')
  }

  if (
    permissionCheck(user, ['editeur', 'lecteur']) &&
    user?.administrations?.length
  ) {
    // un utilisateur 'editeur' ou 'lecteur'
    // ne voit que les utilisateurs de son administration
    const administrationsIds = user.administrations.map(e => e.id)

    q.whereExists(
      (Utilisateurs.relatedQuery('administrations') as QueryBuilder<
        Administrations,
        Administrations | Administrations[]
      >).whereIn('administrations.id', administrationsIds)
    )
  } else if (
    permissionCheck(user, ['entreprise']) &&
    user?.entreprises?.length
  ) {
    // un utilisateur entreprise
    // ne voit que les utilisateurs de son entreprise
    const entreprisesIds = user.entreprises.map(e => e.id)

    q.whereExists(
      (Utilisateurs.relatedQuery('entreprises') as QueryBuilder<
        Entreprises,
        Entreprises | Entreprises[]
      >).whereIn('entreprises.id', entreprisesIds)
    )
  } else if (user && permissionCheck(user, ['defaut'])) {
    // un utilisateur "defaut" ne voit que son propre profil
    q.where('id', user.id)
  } else if (!user) {
    // un utilisateur non-authentifié ne voit aucun utilisateur
    q.limit(0)
  }

  if (permissionCheck(user, ['super'])) {
    q.select(raw('true').as('modification'))
    q.select(raw('true').as('suppression'))
    q.select(raw('true').as('permissionModification'))
  } else if (
    user &&
    permissionCheck(user, ['admin']) &&
    user.administrations?.length
  ) {
    // restreint le droit d'édition d'un utilisateur
    // aux permissions inférieures d'admin
    const permissionsIdsPublic = ['entreprise', 'defaut']
    const permissionsIdsPublicReplace = permissionsIdsPublic.map(() => '?')

    // permissions des administrations
    const permissionsIdsAdmin = ['editeur', 'lecteur']
    const permissionsIdsAdminReplace = permissionsIdsAdmin.map(() => '?')

    const administrationsIds = user.administrations.map(e => e.id)
    const administrationsIdsReplace = user.administrations.map(() => '?')

    q.leftJoin(
      'utilisateurs__administrations as u_a',
      raw(`?? = ?? and ?? in (${administrationsIdsReplace})`, [
        'u_a.utilisateur_id',
        'utilisateurs.id',
        'u_a.administration_id',
        ...administrationsIds
      ])
    )

    const permissionModificationSuppression = (alias: string) =>
      q.select(
        raw(
          `case when
           ?? = ?
           or ?? in (${permissionsIdsPublicReplace})
           or (?? in (${permissionsIdsAdminReplace}) and ?? is not null)
          then true else false end`,
          [
            'utilisateurs.id',
            user.id,
            'utilisateurs.permissionId',
            ...permissionsIdsPublic,
            'utilisateurs.permissionId',
            ...permissionsIdsAdmin,
            'u_a.administration_id'
          ]
        ).as(alias)
      )

    permissionModificationSuppression('modification')

    permissionModificationSuppression('suppression')

    permissionModificationSuppression('permissionModification')
  } else if (user) {
    q.select(
      raw('(case when ?? = ? then true else false end)', [
        'utilisateurs.id',
        user.id
      ]).as('modification')
    )
    q.select(raw('false').as('suppression'))
    q.select(raw('false').as('permissionModification'))
  } else {
    q.select(raw('false').as('modification'))
    q.select(raw('false').as('suppression'))
    q.select(raw('false').as('permissionModification'))
  }

  // console.info(q.toKnexQuery().toString())

  return q
}

export { utilisateursPermissionQueryBuild }
