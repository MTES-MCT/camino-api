import { Model } from 'objection'
import Regions from './regions'

export default class Departements extends Model {
  static tableName = 'departements'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: 'string' }
    }
  }

  static relationMappings = {
    region: {
      relation: Model.BelongsToOneRelation,
      modelClass: Regions,
      join: {
        from: 'departements.regionId',
        to: 'regions.id'
      }
    }
  }
}
