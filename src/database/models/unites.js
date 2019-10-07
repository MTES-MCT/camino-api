import { Model } from 'objection'

export default class Unites extends Model {
  static tableName = 'unites'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: 'string' },
      symbole: { type: 'string' }
    }
  }
}
