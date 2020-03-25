import { ITitreActivite, IFields } from '../../types'
import { QueryBuilder } from 'objection'
import knex from '../index'

import graphFormat from './graph/format'
import { fieldTitreAdd } from './graph/fields-add'
import graphBuild from './graph/build'

import TitresActivites from '../models/titres-activites'
import options from './_options'

const titreActivitePermissionQueryBuild = (
  q: QueryBuilder<TitresActivites, TitresActivites | TitresActivites[]>,
  userId: string
) => {
  q.select('titresActivites.*')

  // isSuper
  q.leftJoin('utilisateurs AS us', b => {
    b.on('us.permissionId', '=', knex.raw('?', 'super'))
    b.on('us.id', '=', knex.raw('?', userId))
  })
  q.select('us.id as isSuper')
  q.groupBy('isSuper')

  if (userId === 'super') {
    return q
  }

  // titulaires et amodiataires
  q.leftJoinRelated(
    'titre.[titulaires.utilisateurs, amodiataires.utilisateurs]'
  )

  // isAdmin
  q.leftJoin('utilisateurs AS ua', b => {
    b.onIn('ua.permissionId', ['admin', 'editeur', 'lecteur'])
    b.on('ua.id', '=', knex.raw('?', userId))
  })
  q.select('ua.id as isAdmin')
  q.groupBy('isAdmin')

  // administrations gestionnaires et locales
  q.leftJoinRelated(
    'titre.[administrationsGestionnaires.utilisateurs, administrationsLocales.utilisateurs]'
  )

  q.andWhere(b => {
    // isSuper
    b.orWhereNotNull('us.id')

    // administrations
    b.orWhereRaw('?? = ?', [
      'titre:administrationsGestionnaires:utilisateurs.id',
      userId
    ]).orWhereRaw('?? = ?', [
      'titre:administrationsLocales:utilisateurs.id',
      userId
    ])

    // titulaires et amodiataires
    b.orWhereRaw('?? = ?', [
      'titre:titulaires:utilisateurs.id',
      userId
    ]).orWhereRaw('?? = ?', ['titre:amodiataires:utilisateurs.id', userId])
  })

  return q
}

const titreActiviteGet = async (
  id: string,
  { fields }: { fields?: IFields },
  userId?: string
) => {
  if (!userId) return null

  const graph = fields
    ? graphBuild(fieldTitreAdd(fields), 'activite', graphFormat)
    : options.titresActivites.graph

  const q = TitresActivites.query()
    .withGraphFetched(graph)
    .findById(id)

  titreActivitePermissionQueryBuild(q, userId)

  q.groupBy('titresActivites.id')

  return q
}

const titresActivitesGet = async (
  { typeId, annee }: { typeId?: string; annee?: number } = {},
  { fields }: { fields?: IFields },
  userId?: string
) => {
  if (!userId) return []

  const graph = fields
    ? graphBuild(fieldTitreAdd(fields), 'activite', graphFormat)
    : options.titresActivites.graph

  const q = TitresActivites.query().withGraphFetched(graph)

  titreActivitePermissionQueryBuild(q, userId)

  q.groupBy('titresActivites.id')

  if (typeId) {
    q.where('titresActivites.typeId', typeId)
  }

  if (annee) {
    q.where('titresActivites.annee', Number(annee))
  }

  return q
}

const titreActivitesUpsert = async (titreActivites: ITitreActivite[]) =>
  TitresActivites.query()
    .withGraphFetched(options.titresActivites.graph)
    .upsertGraph(titreActivites, { insertMissing: true })

const titreActiviteUpdate = async (
  id: string,
  props: Partial<ITitreActivite>,
  { fields }: { fields?: IFields }
) => {
  const graph = fields
    ? graphBuild(fieldTitreAdd(fields), 'activite', graphFormat)
    : options.titresActivites.graph

  return TitresActivites.query()
    .withGraphFetched(graph)
    .patchAndFetchById(id, props)
}

export {
  titreActiviteGet,
  titreActivitesUpsert,
  titresActivitesGet,
  titreActiviteUpdate
}
