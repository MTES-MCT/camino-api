import { Model } from 'objection'

export default class Devises extends Model {
  static tableName = 'devises'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: 'string' }
    }
  }
}
