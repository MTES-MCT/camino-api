const { Model } = require('objection')

class Statuts extends Model {
  static get tableName() {
    return 'statuts'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'nom', 'couleur'],

      properties: {
        id: { type: 'string', maxLength: 3 },
        nom: { type: 'string' },
        couleur: { type: 'string', maxLength: 8 }
      }
    }
  }
}

module.exports = Statuts
