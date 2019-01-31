import { Model } from 'objection'

export default class Emprises extends Model {
  static tableName = 'emprises'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: 'string' }
    }
  }
}
