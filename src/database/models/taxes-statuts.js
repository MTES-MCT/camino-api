import { Model } from 'objection'

export default class TaxesStatuts extends Model {
  static tableName = 'taxesStatuts'

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
