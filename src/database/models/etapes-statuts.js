import { Model } from 'objection'

export default class EtapesStatuts extends Model {
  static tableName = 'etapesStatuts'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'nom', 'couleur'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: ['string', 'null'] },
      couleur: { type: ['string', 'null'], maxLength: 8 }
    }
  }
}
