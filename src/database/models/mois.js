import { Model } from 'objection'

export default class Mois extends Model {
  static tableName = 'mois'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'nom', 'trimestreId'],

    properties: {
      id: { type: 'integer', maxLength: 2 },
      nom: { type: 'string' },
      frequenceId: { type: 'string', maxLength: 3 },
      trimestreId: { type: 'integer', maxLength: 1 }
    }
  }
}
