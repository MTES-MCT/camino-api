import { Model } from 'objection'
import { join } from 'path'
import Departements from './departements'

export default class Communes extends Model {
  public static tableName = 'communes'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 8 },
      nom: { type: 'string' }
    }
  }

  public static relationMappings = {
    departement: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'departements'),
      join: {
        from: 'communes.departementId',
        to: 'departements.id'
      }
    }
  }

  public id!: string
  public nom!: string
  public departement!: Departements
}
