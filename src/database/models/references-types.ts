import { Model } from 'objection'

import { IReferenceType } from '../../types'

interface ReferencesTypes extends IReferenceType {}

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
