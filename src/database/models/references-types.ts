import { Model } from 'objection'

import { IReferencesTypes } from '../../types'

interface ReferencesTypes extends IReferencesTypes {}

class ReferencesTypes extends Model {
  public static tableName = 'referencesTypes'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxlength: 3 },
      nom: { type: 'string' }
    }
  }
}

export default ReferencesTypes
