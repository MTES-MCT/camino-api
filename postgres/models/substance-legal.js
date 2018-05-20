const { Model } = require('objection')

class SubstanceLegal extends Model {
  static get tableName() {
    return 'substance_legals'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'nom', 'domaine', 'type', 'usage', 'legal_id'],

      properties: {
        id: { type: 'string' },
        nom: { type: 'string' },
        description: { type: 'string' },
        lien: { type: 'string' }
      }
    }
  }
}

module.exports = SubstanceLegal
