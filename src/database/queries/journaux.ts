import Journaux from '../models/journaux'
import { create } from 'jsondiffpatch'
import {
  Model,
  PartialModelGraph,
  RelationExpression,
  Transaction,
  UpsertGraphOptions
} from 'objection'
import { journauxQueryModify } from './permissions/journaux'
import { IFields, IUtilisateur } from '../../types'
import graphBuild from './graph/build'
import { fieldsFormat } from './graph/fields-format'
import options from './_options'
import { IJournauxQueryParams } from '../../api/graphql/resolvers/journaux'

const diffPatcher = create({
  // on filtre certaines proprietés qu’on ne souhaite pas voir apparaitre dans les journaux
  propertyFilter: (name: string) =>
    !['slug', 'ordre', 'demarche', 'heritageProps'].includes(name)
})

export const journauxGet = async (
  params: IJournauxQueryParams,
  { fields }: { fields?: IFields },
  user: IUtilisateur | null | undefined
) => {
  const graph = fields
    ? graphBuild(fields, 'journaux', fieldsFormat)
    : options.journaux.graph

  const q = Journaux.query().withGraphFetched(graph)
  q.modify(journauxQueryModify, user)

  if (params.recherche) {
    q.leftJoinRelated('titre as titreRecherche')
    q.whereRaw(`lower(??) like ?`, [
      'titreRecherche.nom',
      `%${params.recherche.toLowerCase()}%`
    ])
  }

  if (params.titreId) {
    q.where('titreId', params.titreId)
  }

  q.orderBy('date', 'desc')

  return q.page(params.page - 1, params.intervalle)
}

export const deleteJournalCreate = async (
  id: string,
  model: typeof Model,
  userId: string,
  titreId: string,
  trx?: Transaction
) => {
  const oldValue = await model.query(trx).findById(id)

  await Journaux.query(trx).insert({
    elementId: id,
    operation: 'delete',
    utilisateurId: userId,
    titreId,
    differences: diffPatcher.diff(oldValue, {})
  })
}

export const createJournalCreate = async (
  id: string,
  userId: string,
  titreId: string
) => {
  await Journaux.query().insert({
    elementId: id,
    operation: 'create',
    utilisateurId: userId,
    titreId
  })
}

export const patchJournalCreate = async <T extends Model>(
  id: string,
  partialEntity: Partial<T>,
  model: typeof Model,
  userId: string,
  titreId: string
) => {
  const oldValue = await model.query().findById(id)

  const oldPartialValue = (
    Object.keys(partialEntity) as Array<keyof Model>
  ).reduce((result, key) => {
    result[key] = oldValue![key]

    return result
  }, {} as any)

  const result = await model.query().patchAndFetchById(id, {
    ...partialEntity,
    id
  })

  const differences = diffPatcher.diff(oldPartialValue, partialEntity)

  if (differences) {
    await Journaux.query().insert({
      elementId: id,
      utilisateurId: userId,
      operation: 'update',
      differences,
      titreId
    })
  }

  return result
}

export const upsertJournalCreate = async <T extends Model>(
  id: string | undefined,
  entity: PartialModelGraph<T>,
  model: typeof Model,
  options: UpsertGraphOptions,
  relations: RelationExpression<T>,
  userId: string,
  titreId: string
): Promise<T> => {
  const oldValue = id
    ? await model
        .query()
        .findById(id)
        .withGraphFetched(relations)
        .returning('*')
    : undefined

  // on ne peut pas utiliser returning('*'),
  // car certains attributs de entity restent présents alors qu’ils sont enlevés avant l’enregistrement
  const newModel = await model
    .query()
    .upsertGraph(entity, options)
    .returning('id')

  const newValue = await model
    .query()
    .findById((newModel as any).id)
    .withGraphFetched(relations)
    .returning('*')

  let differences: any
  let operation: 'create' | 'update' = 'create'

  if (oldValue) {
    differences = diffPatcher.diff(oldValue, newValue)

    // si il n’y a pas de différences, alors on ne journal plus cette modification
    if (!differences || !Object.keys(differences).length) {
      return newValue as T
    }
    operation = 'update'
  }

  await Journaux.query().insert({
    elementId: (newValue as any).id,
    utilisateurId: userId,
    operation,
    differences,
    titreId
  })

  return newValue as T
}
