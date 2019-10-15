import { Model } from 'objection'
import { join } from 'path'

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
      modelClass: join(__dirname, 'pays'),
      join: {
        from: 'regions.paysId',
        to: 'pays.id'
      }
    },

    departements: {
      relation: Model.HasManyRelation,
      modelClass: join(__dirname, 'departements'),
      join: {
        from: 'regions.id',
        to: 'departements.regionId'
      }
    }
  }
}
