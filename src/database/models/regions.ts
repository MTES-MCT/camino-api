import { Model } from 'objection'
import { join } from 'path'
import Departements from './departements'
import Pays from './pays'

export default class Regions extends Model {
  public static tableName = 'regions'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 2 },
      nom: { type: 'string' }
    }
  }

  public static relationMappings = {
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

  public id!: string
  public nom!: string
  public pays!: Pays
  public departements!: Departements[]
}
