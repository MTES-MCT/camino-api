import { Model } from 'objection'
import { join } from 'path'

export default class Communes extends Model {
  static tableName = 'communes'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 8 },
      nom: { type: 'string' }
    }
  }

  static relationMappings = {
    departement: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'departements'),
      join: {
        from: 'communes.departementId',
        to: 'departements.id'
      }
    }
  }
}
