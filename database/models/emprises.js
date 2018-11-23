const { Model } = require('objection')

class Emprises extends Model {
  static get tableName() {
    return 'emprises'
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

module.exports = Emprises
