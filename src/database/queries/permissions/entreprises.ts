import { IUtilisateur } from '../../../types'

import { raw, QueryBuilder } from 'objection'
import { permissionCheck } from '../../../tools/permission'

import Entreprises from '../../models/entreprises'
import Utilisateurs from '../../models/utilisateurs'
import Titres from '../../models/titres'

import { titrePermissionQueryBuild } from './titres'
import { utilisateursPermissionQueryBuild } from './utilisateurs'

const entreprisePermissionQueryBuild = (
  q: QueryBuilder<Entreprises, Entreprises | Entreprises[]>,
  user?: IUtilisateur
) => {
  console.log('entreprisePermissionQueryBuild')

  q.select('entreprises.*')

  if (permissionCheck(user, ['super', 'admin', 'editeur'])) {
    q.select(raw('true').as('modification'))
  } else {
    q.select(raw('false').as('modification'))
  }

  q.modifyGraph('titresTitulaire', a =>
    titrePermissionQueryBuild(
      a as QueryBuilder<Titres, Titres | Titres[]>,
      user
    )
  )

  q.modifyGraph('titresAmodiataire', a =>
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

  // console.log(q.toKnexQuery().toString())

  return q
}

export { entreprisePermissionQueryBuild }
