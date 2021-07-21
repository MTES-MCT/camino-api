import Logs from '../models/logs'
import { create } from 'jsondiffpatch'
import {
  Model,
  PartialModelGraph,
  RelationExpression,
  UpsertGraphOptions
} from 'objection'

const diffPatcher = create({
  // on filtre certaines proprietés qu’on ne souhaite pas voir apparaitre dans les logs
  propertyFilter: (name: string) => !['slug', 'ordre'].includes(name)
})

export const deleteLogCreate = async (id: string, userId: string) => {
  await Logs.query().insert({
    elementId: id,
    operation: 'delete',
    utilisateurId: userId
  })
}

export const createLogCreate = async (id: string, userId: string) => {
  await Logs.query().insert({
    elementId: id,
    operation: 'create',
    utilisateurId: userId
  })
}

export const patchLogCreate = async <T extends Model>(
  id: string,
  partialEntity: Partial<T>,
  model: typeof Model,
  userId: string
) => {
  const oldValue = await model.query().findById(id)

  const oldPartialValue = (
    Object.keys(partialEntity) as Array<keyof Model>
  ).reduce((result, key) => {
    result[key] = oldValue[key]

    return result
  }, {} as any)

  const result = await model.query().patchAndFetchById(id, {
    ...partialEntity,
    id
  })

  const differences = diffPatcher.diff(oldPartialValue, partialEntity)

  if (differences) {
    await Logs.query().insert({
      elementId: id,
      utilisateurId: userId,
      operation: 'update',
      differences
    })
  }

  return result
}

export const upsertLogCreate = async <T extends Model>(
  id: string,
  entity: PartialModelGraph<T>,
  model: typeof Model,
  options: UpsertGraphOptions,
  relations: RelationExpression<T>,
  userId: string
): Promise<T> => {
  const oldValue = id
    ? await model
        .query()
        .findById(id)
        .withGraphFetched(relations)
        .returning('*')
    : undefined

  const newValue = await model
    .query()
    .upsertGraph(entity, options)
    .withGraphFetched(relations)
    .returning('*')

  let differences: any
  let operation: 'create' | 'update' = 'create'

  if (oldValue) {
    differences = diffPatcher.diff(oldValue, newValue)

    // si il n’y a pas de différences, alors on ne log plus cette modification
    if (!differences || !Object.keys(differences).length) {
      return newValue as T
    }
    operation = 'update'
  }

  await Logs.query().insert({
    elementId: (newValue as any).id,
    utilisateurId: userId,
    date: new Date(),
    operation,
    differences
  })

  return newValue as T
}
