import { Model } from 'objection'

export default class TitresDocuments extends Model {
  static tableName = 'titresDocuments'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'titreEtapeId', 'nom'],

    properties: {
      id: { type: 'string' },
      titreEtapeId: { type: 'string', maxLength: 128 },
      jorf: { type: ['string', 'null'] },
      nor: { type: ['string', 'null'] },
      url: { type: ['string', 'null'] },
      uri: { type: ['string', 'null'] },
      nom: { type: 'string' },
      type: { type: 'string' },
      fichier: { type: ['string', 'null'] },
      public: { type: ['boolean', 'null'] }
    }
  }
}
