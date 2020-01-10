import { Model } from 'objection'
import Unites from './unites'

export default class GeoSystemes extends Model {
  public static tableName = 'geoSystemes'

  public static jsonSchema = {
    required: ['id', 'nom', 'definitionProj4'],
    type: 'object',

    properties: {
      id: { type: 'string', maxLength: 5 },
      definitionProj4: { type: 'string' },
      nom: { type: 'string' },
      ordre: { type: 'integer' },
      uniteId: { type: 'string' },
      zone: { type: 'string' }
    }
  }

  public static relationMappings = {
    unite: {
      relation: Model.BelongsToOneRelation,
      modelClass: Unites,
      join: {
        from: 'geoSystemes.uniteId',
        to: 'unites.id'
      }
    }
  }

  public id!: string
  public definitionProj4!: string
}
