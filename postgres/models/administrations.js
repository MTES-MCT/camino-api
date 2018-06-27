const { Model } = require('objection')

class Administrations extends Model {
  static get tableName() {
    return 'administrations'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'nom'],

      properties: {
        id: { type: 'string', maxLength: 64 },
        nom: { type: 'string' },
        contact_id: { type: 'string' }
      }
    }
  }
}

module.exports = Administrations
