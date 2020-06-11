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

  if (permissionCheck(user?.permissionId, ['super', 'admin', 'editeur'])) {
    q.select(raw('true').as('modification'))
  } else if (
    permissionCheck(user?.permissionId, ['entreprise']) &&
    user?.entreprises?.length
  ) {
    q.leftJoin(
      'utilisateurs__entreprises as u_e',
      raw('?? = ?? and ?? = ?', [
        'u_e.entrepriseId',
        'entreprises.id',
        'u_e.utilisateurId',
        user.id
      ])
    )

    q.select(
      raw('(case when ?? = ? then true else false end)', [
        'u_e.utilisateurId',
        user.id
      ]).as('modification')
    )
  } else {
    q.select(raw('false').as('modification'))
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
