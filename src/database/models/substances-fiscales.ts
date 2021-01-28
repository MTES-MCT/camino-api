import { Model } from 'objection'

import { ISubstanceFiscale } from '../../types'
import Unites from './unites'

interface SubstancesFiscales extends ISubstanceFiscale {}

class SubstancesFiscales extends Model {
  public static tableName = 'substancesFiscales'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom', 'substanceLegaleId', 'uniteId'],

    properties: {
      id: { type: 'string' },
      nom: { type: 'string' },
      description: { type: 'string' },
      uniteId: { type: 'string' },
      substanceLegaleId: { type: 'string' }
    }
  }

  public static relationMappings = {
    unite: {
      relation: Model.BelongsToOneRelation,
      modelClass: Unites,
      join: {
        from: 'substancesFiscales.uniteId',
        to: 'unites.id'
      }
    }
  }
}

export default SubstancesFiscales
