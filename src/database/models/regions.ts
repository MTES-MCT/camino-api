import { Model } from 'objection'

import { IRegion } from '../../types'
import Pays from './pays'
import Departements from './departements'

interface Regions extends IRegion {}

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

  static relationMappings = () => ({
    pays: {
      relation: Model.BelongsToOneRelation,
      modelClass: Pays,
      join: {
        from: 'regions.paysId',
        to: 'pays.id'
      }
    },

    departements: {
      relation: Model.HasManyRelation,
      modelClass: Departements,
      join: {
        from: 'regions.id',
        to: 'departements.regionId'
      }
    }
  })
}

export default Regions
