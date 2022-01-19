import { Model } from 'objection'

import { IDepartement } from '../../types'
import Regions from './regions'
import Communes from './communes'

interface Departements extends IDepartement {}

class Departements extends Model {
  public static tableName = 'departements'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: 'string' }
    }
  }

  static relationMappings = () => ({
    region: {
      relation: Model.BelongsToOneRelation,
      modelClass: Regions,
      join: {
        from: 'departements.regionId',
        to: 'regions.id'
      }
    },

    communes: {
      relation: Model.HasManyRelation,
      modelClass: Communes,
      join: {
        from: 'departements.id',
        to: 'communes.departementId'
      }
    }
  })
}

export default Departements
