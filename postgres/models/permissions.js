const { Model } = require('objection')

class Permissions extends Model {
  static get tableName() {
    return 'permissions'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'nom'],

      properties: {
        id: { type: 'string', maxLength: 4 },
        nom: { type: 'string' }
      }
    }
  }
}

module.exports = Permissions
