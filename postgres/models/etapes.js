const { Model } = require('objection')

class Etapes extends Model {
  static get tableName() {
    return 'etapes'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'nom'],

      properties: {
        id: { type: 'string', maxLength: 3 },
        nom: {
          type: 'string',
          maxLength: 128
        },
        acceptation_auto: {
          type: 'boolean'
        }
      }
    }
  }
}

module.exports = Etapes
