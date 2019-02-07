import { Model } from 'objection'
import Departements from './departements'

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
      modelClass: Departements,
      join: {
        from: 'communes.departementId',
        to: 'departements.id'
      }
    }
  }
}
