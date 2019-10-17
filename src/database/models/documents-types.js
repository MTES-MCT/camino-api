import { Model } from 'objection'

export default class DocumentsTypes extends Model {
  static tableName = 'documentsTypes'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: 'string', maxLength: 128 }
    }
  }
}
