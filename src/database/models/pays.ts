import { Model } from 'objection'

import { IPays } from '../../types'
import Regions from './regions'

interface Pays extends IPays {}

class Pays extends Model {
  public static tableName = 'pays'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: 'string' }
    }
  }

  static relationMappings = () => ({
    regions: {
      relation: Model.HasManyRelation,
      modelClass: Regions,
      join: { from: 'pays.id', to: 'regions.paysId' }
    }
  })
}

export default Pays
