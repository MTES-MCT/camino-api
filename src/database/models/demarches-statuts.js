import { Model } from 'objection'

export default class DemarchesStatuts extends Model {
  static tableName = 'demarchesStatuts'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'nom', 'couleur'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: 'string' },
      couleur: { type: 'string', maxLength: 8 }
    }
  }
}
