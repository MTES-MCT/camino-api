import { Model, Modifiers } from 'objection'
import Unites from './unites'

import { IGeoSysteme } from '../../types'

interface GeoSystemes extends IGeoSysteme {}

class GeoSystemes extends Model {
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

  static relationMappings = () => ({
    unite: {
      relation: Model.BelongsToOneRelation,
      modelClass: Unites,
      join: {
        from: 'geoSystemes.uniteId',
        to: 'unites.id'
      }
    }
  })

  public static modifiers: Modifiers = {
    orderAsc: builder => {
      builder.orderBy('ordre', 'asc')
    }
  }
}

export default GeoSystemes
