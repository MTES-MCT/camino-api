const { Model } = require('objection')

class SubstanceLegals extends Model {
  static get tableName() {
    return 'substancesLegals'
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

module.exports = SubstanceLegals
