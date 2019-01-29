const { Model } = require('objection')

class TitresDocuments extends Model {
  static get tableName() {
    return 'titresDocuments'
  }

  static get jsonSchema() {
    return {
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
}

module.exports = TitresDocuments
