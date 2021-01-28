import { Model } from 'objection'

import { ISubstanceFiscale } from '../../types'

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
}

export default SubstancesFiscales
