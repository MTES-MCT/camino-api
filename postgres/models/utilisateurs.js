const { Model } = require('objection')

class Utilisateurs extends Model {
  static get tableName() {
    return 'utilisateurs'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'nom'],

      properties: {
        id: { type: 'string', maxLength: 64 },
        nom: { type: 'string' },
        prenom: { type: 'string' },
        email: { type: 'string' },
        telephone_fixe: { type: 'string' },
        telephone_mobile: { type: 'string' }
      }
    }
  }
}

module.exports = Utilisateurs
