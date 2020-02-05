import { Model } from 'objection'
import { join } from 'path'

import { IRegions } from '../../types'

interface Regions extends IRegions {}

class Regions extends Model {
  public static tableName = 'regions'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 2 },
      nom: { type: 'string' },
      paysId: { type: 'string' }
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
}

export default Regions
