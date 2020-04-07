import { IUtilisateur } from '../../../types'

import { raw, QueryBuilder } from 'objection'
import { permissionCheck } from '../../../tools/permission'

import Administrations from '../../models/administrations'
import Utilisateurs from '../../models/utilisateurs'
import Titres from '../../models/titres'

import { titrePermissionQueryBuild } from './titres'
import { utilisateursPermissionQueryBuild } from './utilisateurs'

const administrationsPermissionQueryBuild = (
  q: QueryBuilder<Administrations, Administrations | Administrations[]>,
  user?: IUtilisateur
) => {
  console.log('administrationPermissionQueryBuild')

  q.select('administrations.*')

  if (
    permissionCheck(user, ['admin', 'editeur', 'lecteur']) &&
    user?.administrations?.length
  ) {
    // propriété 'membre'

    const administrationsIds = user.administrations.map(a => a.id) || []
    const administrationsIdsReplace = administrationsIds.map(() => '?')

    q.select(
      raw(
        `(case when ?? in (${administrationsIdsReplace}) then true else false end)`,
        ['administrations.id', ...administrationsIds]
      ).as('membre')
    )
  }

  q.modifyGraph('titresAdministrationGestionnaire', a =>
    titrePermissionQueryBuild(
      a as QueryBuilder<Titres, Titres | Titres[]>,
      user
    )
  )

  q.modifyGraph('titresAdministrationLocale', a =>
    titrePermissionQueryBuild(
      a as QueryBuilder<Titres, Titres | Titres[]>,
      user
    )
  )

  q.modifyGraph('utilisateurs', u =>
    utilisateursPermissionQueryBuild(
      u as QueryBuilder<Utilisateurs, Utilisateurs | Utilisateurs[]>,
      user
    )
  )

  return q
}

export { administrationsPermissionQueryBuild }
