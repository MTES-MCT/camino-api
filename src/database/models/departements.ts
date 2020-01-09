import { Model } from 'objection'
import { join } from 'path'
import Communes from './communes'
import Regions from './regions'

export default class Departements extends Model {
  public static tableName = 'departements'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: 'string' }
    }
  }

  public static relationMappings = {
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

  public id!: string
  public nom!: string
  public region!: Regions
  public communes?: Communes[]
}
