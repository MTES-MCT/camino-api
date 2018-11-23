const { Model } = require('objection')

class Types extends Model {
  static get tableName() {
    return 'types'
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

module.exports = Types
