import { Model } from 'objection'

export default class Outremers extends Model {
  static tableName = 'pays'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: 'string' }
    }
  }
}
