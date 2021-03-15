import { IFields, IUtilisateur } from '../../../types'

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
  fields?: IFields,
  user?: IUtilisateur
) => {
  q.select('entreprises.*')

  if (permissionCheck(user?.permissionId, ['super', 'admin', 'editeur'])) {
    q.select(raw('true').as('modification'))
  } else if (
    permissionCheck(user?.permissionId, ['entreprise']) &&
    user?.entreprises?.length
  ) {
    const utilisateurEntreprise = Utilisateurs.query().leftJoin(
      'utilisateurs__entreprises as u_e',
      raw('?? = ?? and ?? = ?', [
        'u_e.entrepriseId',
        'entreprises.id',
        'u_e.utilisateurId',
        user.id
      ])
    )

    q.select(raw('exists (?)', [utilisateurEntreprise]).as('modification'))
  } else {
    q.select(raw('false').as('modification'))
  }

  q.modifyGraph('titulaireTitres', a =>
    titrePermissionQueryBuild(
      a as QueryBuilder<Titres, Titres | Titres[]>,
      fields?.titulaireTitres,
      user
    )
      // on group by entrepriseId au cas où il y a une aggrégation
      // dans la requête de titre (ex : calc activités)
      .groupBy('titres.id', 'titresTitulaires.entrepriseId')
  )

  q.modifyGraph('amodiataireTitres', a =>
    titrePermissionQueryBuild(
      a as QueryBuilder<Titres, Titres | Titres[]>,
      fields?.amodiataireTitres,
      user
    )
      // on group by entrepriseId au cas où il y a une aggrégation
      // dans la requête de titre (ex : calc activités)
      .groupBy('titres.id', 'titresAmodiataires.entrepriseId')
  )

  q.modifyGraph('utilisateurs', b => {
    utilisateursPermissionQueryBuild(
      b as QueryBuilder<Utilisateurs, Utilisateurs | Utilisateurs[]>,
      fields,
      user
    )
  })

  q.modifyGraph('documents', b => {
    documentsPermissionQueryBuild(
      b as QueryBuilder<Documents, Documents | Documents[]>,
      user
    )
  })

  return q
}

const entreprisesTitresQuery = (
  entreprisesIds: string[],
  titreAlias: string,
  {
    isTitulaire,
    isAmodiataire
  }: { isTitulaire?: boolean; isAmodiataire?: boolean } = {}
) => {
  const q = Entreprises.query().whereIn('entreprises.id', entreprisesIds)

  if (isTitulaire) {
    q.modify(entreprisesTitulairesModifier, entreprisesIds, titreAlias)
  }

  if (isAmodiataire) {
    q.modify(entreprisesAmodiatairesModifier, entreprisesIds, titreAlias)
  }

  q.where(c => {
    if (isTitulaire) {
      c.orWhereNotNull('t_t.entrepriseId')
    }

    if (isAmodiataire) {
      c.orWhereNotNull('t_a.entrepriseId')
    }
  })

  return q
}

const entreprisesTitulairesModifier = (
  q: QueryBuilder<Entreprises, Entreprises | Entreprises[]>,
  entreprisesIds: string[],
  titreAlias: string
) => {
  const entreprisesIdsReplace = entreprisesIds.map(() => '?').join(',')

  q.leftJoin(
    'titresTitulaires as t_t',
    raw(`?? ->> ? = ?? and ?? in (${entreprisesIdsReplace})`, [
      `${titreAlias}.propsTitreEtapesIds`,
      'titulaires',
      't_t.titreEtapeId',
      't_t.entrepriseId',
      ...entreprisesIds
    ])
  )
}

const entreprisesAmodiatairesModifier = (
  q: QueryBuilder<Entreprises, Entreprises | Entreprises[]>,
  entreprisesIds: string[],
  titreAlias: string
) => {
  const entreprisesIdsReplace = entreprisesIds.map(() => '?').join(',')

  q.leftJoin(
    'titresAmodiataires as t_a',
    raw(`?? ->> ? = ?? and ?? in (${entreprisesIdsReplace})`, [
      `${titreAlias}.propsTitreEtapesIds`,
      'amodiataires',
      't_a.titreEtapeId',
      't_a.entrepriseId',
      ...entreprisesIds
    ])
  )
}

export { entreprisePermissionQueryBuild, entreprisesTitresQuery }
