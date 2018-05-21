const { Model } = require('objection')

class Statut extends Model {
  static get tableName() {
    return 'titres_statuts'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'nom'],

      properties: {
        id: { type: 'string', maxLength: 3 },
        nom: { type: 'string' }
      }
    }
  }
}

module.exports = Statut
