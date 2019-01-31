import { Model } from 'objection'
import Types from './types'

export default class Domaines extends Model {
  static tableName = 'domaines'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 1 },
      nom: { type: 'string' }
    }
  }

  static relationMappings = {
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
}
