import { IUtilisateur } from '../../../types'

import { raw, QueryBuilder } from 'objection'
import { permissionCheck } from '../../../tools/permission'
import Utilisateurs from '../../models/utilisateurs'


import Administrations from '../../models/administrations'
import Entreprises from '../../models/entreprises'

const utilisateursPermissionQueryBuild = (
  q: QueryBuilder<Utilisateurs, Utilisateurs | Utilisateurs[]>,
  user?: IUtilisateur
) => {
  console.log('utilisateursPermissionQueryBuild')

  q.select('utilisateurs.*')

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

  if (permissionCheck(user, ['super', 'admin'])) {
    q.select(raw('true').as('modification'))
    q.select(raw('true').as('suppression'))
    q.select(raw('true').as('permissionModification'))
  } else if (user) {
    q.select(
      raw('(case when utilisateurs.id = ? then true else false end)', [
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

  // console.log(q.toKnexQuery().toString())

  return q
}

export { utilisateursPermissionQueryBuild }