import { Model } from 'objection'

export default class ReferencesTypes extends Model {
  static tableName = 'referencesTypes'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxlength: 3 },
      nom: { type: 'string' }
    }
  }
}
