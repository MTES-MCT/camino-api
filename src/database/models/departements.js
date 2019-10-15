import { Model } from 'objection'
import { join } from 'path'

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
      modelClass: join(__dirname, 'regions'),
      join: {
        from: 'departements.regionId',
        to: 'regions.id'
      }
    },

    communes: {
      relation: Model.HasManyRelation,
      modelClass: join(__dirname, 'communes'),
      join: {
        from: 'departements.id',
        to: 'communes.departementId'
      }
    }
  }
}
