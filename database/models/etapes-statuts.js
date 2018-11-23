const { Model } = require('objection')

class EtapesStatuts extends Model {
  static get tableName() {
    return 'etapesStatuts'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'nom', 'couleur'],

      properties: {
        id: { type: 'string', maxLength: 3 },
        nom: { type: ['string', 'null'] },
        couleur: { type: ['string', 'null'], maxLength: 8 }
      }
    }
  }
}

module.exports = EtapesStatuts
