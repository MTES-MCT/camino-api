import { Model } from 'objection'

export default class Annees extends Model {
  static tableName = 'annees'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'integer', maxLength: 1 },
      nom: { type: 'string' },
      frequenceId: { type: 'string', maxLength: 3 }
    }
  }
}
