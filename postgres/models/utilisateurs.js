const { Model } = require('objection')

class Utilisateurs extends Model {
  static get tableName() {
    return 'utilisateurs'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'email', 'password'],

      properties: {
        id: { type: 'string', maxLength: 64 },
        email: { type: 'string' },
        password: { type: 'string' },
        nom: { type: 'string' },
        prenom: { type: 'string' },
        telephone_fixe: { type: 'string' },
        telephone_mobile: { type: 'string' },
        entrepriseId: { type: 'string', maxLength: 64 },
        administrationId: { type: 'string', maxLength: 64 }
      }
    }
  }
}

module.exports = Utilisateurs
