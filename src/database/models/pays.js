import { Model } from 'objection'
import { join } from 'path'

export default class Outremers extends Model {
  static tableName = 'pays'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: 'string' }
    }
  }

  static relationMappings = {
    regions: {
      relation: Model.HasManyRelation,
      modelClass: join(__dirname, 'regions'),
      join: {
        from: 'pays.id',
        to: 'regions.paysId'
      }
    }
  }
}
