import { Model } from 'objection'

export default class TitresDocuments extends Model {
  static tableName = 'titresDocuments'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'titreEtapeId', 'nom', 'date'],

    properties: {
      id: { type: 'string' },
      titreEtapeId: { type: 'string', maxLength: 128 },
      type: { type: 'string' },
      nom: { type: 'string' },
      url: { type: 'string' },
      uri: { type: 'string' },
      fichier: { type: 'string' },
      jorf: { type: 'string' },
      nor: { type: 'string' }
    }
  }
}
