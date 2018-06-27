const { Model } = require('objection')

class SubstancesLegals extends Model {
  static get tableName() {
    return 'substances_legals'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'nom', 'lien'],

      properties: {
        id: { type: 'string' },
        nom: { type: 'string' },
        description: { type: 'string' },
        lien: { type: 'string' }
      }
    }
  }
}

module.exports = SubstancesLegals
