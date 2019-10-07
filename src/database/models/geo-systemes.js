import { Model } from 'objection'
import Unites from './unites'

export default class GeoSystemes extends Model {
  static tableName = 'geoSystemes'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 5 },
      nom: { type: 'string' },
      uniteId: { type: 'string' },
      zone: { type: 'string' }
    }
  }

  static relationMappings = {
    unite: {
      relation: Model.BelongsToOneRelation,
      modelClass: Unites,
      join: {
        from: 'geoSystemes.uniteId',
        to: 'unites.id'
      }
    }
  }
}
