const { Model } = require('objection')

class Groupes extends Model {
  static get tableName() {
    return 'groupes'
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

module.exports = Groupes
