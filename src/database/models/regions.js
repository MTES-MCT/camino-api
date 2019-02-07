import { Model } from 'objection'
import Pays from './pays'

export default class Regions extends Model {
  static tableName = 'regions'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 2 },
      nom: { type: 'string' }
    }
  }

  static relationMappings = {
    pays: {
      relation: Model.BelongsToOneRelation,
      modelClass: Pays,
      join: {
        from: 'regions.paysId',
        to: 'pays.id'
      }
    }
  }
}
