const { Model } = require('objection')

class SubstancesLegalesCodes extends Model {
  static get tableName() {
    return 'substancesLegalesCodes'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'nom', 'description', 'lien'],

      properties: {
        id: { type: 'string' },
        nom: { type: ['string', 'null'] },
        description: { type: ['string', 'null'] },
        lien: { type: ['string', 'null'] }
      }
    }
  }
}

module.exports = SubstancesLegalesCodes
