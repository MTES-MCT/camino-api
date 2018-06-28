const { Model } = require('objection')

class TitresDocuments extends Model {
  static get tableName() {
    return 'titres_documents'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'titre_etape_id', 'nom', 'date'],

      properties: {
        id: { type: 'string' },
        titre_etape_id: { type: 'string', maxLength: 128 },
        nom: { type: 'string' },
        date: { type: 'date' },
        url: { type: 'string' },
        fichier: { type: 'string' }
      }
    }
  }
}

module.exports = TitresDocuments
