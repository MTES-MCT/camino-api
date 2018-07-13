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
        nom: { type: 'string' },
        date: { type: 'date' },
        url: { type: 'string' },
        fichier: { type: 'string' }
      }
    }
  }
}

module.exports = TitresDocuments
