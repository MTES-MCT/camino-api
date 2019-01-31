import { Model } from 'objection'

export default class SubstancesLegalesCodes extends Model {
  static tableName = 'substancesLegalesCodes'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'nom', 'description', 'lien'],

    properties: {
      id: { type: 'string' },
      nom: { type: ['string', 'null'] },
      description: { type: ['string', 'null'] },
      lien: { type: ['string', 'null'] }
    }
  }
}
