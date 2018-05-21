const { Model } = require('objection')

class Statuts extends Model {
  static get tableName() {
    return 'titresStatuts'
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

module.exports = Statuts
