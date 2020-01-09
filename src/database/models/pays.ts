import { Model } from 'objection'
import { join } from 'path'
import Regions from './regions'

export default class Pays extends Model {
  public static tableName = 'pays'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: 'string' }
    }
  }

  public static relationMappings = {
    regions: {
      relation: Model.HasManyRelation,
      modelClass: join(__dirname, 'regions'),
      join: {
        from: 'pays.id',
        to: 'regions.paysId'
      }
    }
  }

  public id!: string
  public nom!: string
  public regions!: Regions[]
}
