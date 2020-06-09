import { IUtilisateur } from '../../../types'

import { raw, QueryBuilder } from 'objection'
import { permissionCheck } from '../../../tools/permission'

import Entreprises from '../../models/entreprises'
import Utilisateurs from '../../models/utilisateurs'
import Titres from '../../models/titres'
import Documents from '../../models/documents'

import { titrePermissionQueryBuild } from './titres'
import { utilisateursPermissionQueryBuild } from './utilisateurs'
import { documentsPermissionQueryBuild } from './documents'

const entreprisePermissionQueryBuild = (
  q: QueryBuilder<Entreprises, Entreprises | Entreprises[]>,
  user?: IUtilisateur
) => {
  q.select('entreprises.*')

  if (permissionCheck(user, ['super', 'admin', 'editeur'])) {
    q.select(raw('true').as('modification'))
    q.select(raw('true').as('documentsCreation'))
  } else if (
    permissionCheck(user, ['entreprise']) &&
    user?.entreprises?.length
  ) {
    q.select(raw('false').as('modification'))

    q.leftJoinRelated('utilisateurs')

    q.select(
      raw('(case when ?? = ? then true else false end)', [
        'utilisateurs.id',
        user.id
      ]).as('documentsCreation')
    )
  } else {
    q.select(raw('false').as('modification'))
    q.select(raw('false').as('documentsCreation'))
  }

  q.modifyGraph('titresTitulaire', a =>
    titrePermissionQueryBuild(
      a as QueryBuilder<Titres, Titres | Titres[]>,
      user
    ).groupBy('titresTitulaires.entrepriseId')
  )

  q.modifyGraph('titresAmodiataire', a =>
    titrePermissionQueryBuild(
      a as QueryBuilder<Titres, Titres | Titres[]>,
      user
    ).groupBy('titresAmodiataires.entrepriseId')
  )

  q.modifyGraph('utilisateurs', u =>
    utilisateursPermissionQueryBuild(
      u as QueryBuilder<Utilisateurs, Utilisateurs | Utilisateurs[]>,
      user
    )
  )

  q.modifyGraph('documents', u =>
    documentsPermissionQueryBuild(
      u as QueryBuilder<Documents, Documents | Documents[]>,
      user
    )
  )

  // console.info(q.toKnexQuery().toString())

  return q
}

export { entreprisePermissionQueryBuild }
