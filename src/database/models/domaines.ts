import { Model, Modifiers } from 'objection'
import Types from './types'

export default class Domaines extends Model {
  public static tableName = 'domaines'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 1 },
      nom: { type: 'string' },
      ordre: { type: 'integer' }
    }
  }

  public static relationMappings = {
    types: {
      relation: Model.ManyToManyRelation,
      modelClass: Types,
      join: {
        from: 'domaines.id',
        through: {
          from: 'domaines__types.domaineId',
          to: 'domaines__types.typeId',
          extra: ['archive']
        },
        to: 'types.id'
      }
    }
  }

  public static modifiers: Modifiers = {
    orderAsc: builder => {
      builder.orderBy('ordre', 'asc')
    }
  }

  public id!: string
  public nom!: string
  public ordre!: number
  public types!: Types
}
