import { Model } from 'objection'

export default class TitresDocuments extends Model {
  static tableName = 'titresDocuments'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'titreEtapeId', 'nom'],

    properties: {
      id: { type: 'string' },
      titreEtapeId: { type: 'string', maxLength: 128 },
      type: { type: 'string' },
      nom: { type: 'string' },
      url: { type: ['string', 'null'] },
      uri: { type: ['string', 'null'] },
      fichier: { type: ['string', 'null'] },
      jorf: { type: ['string', 'null'] },
      nor: { type: ['string', 'null'] },
      public: { type: ['boolean', 'null'] }
    }
  }
}
