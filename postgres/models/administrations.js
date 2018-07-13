const { Model } = require('objection')
const Utilisateurs = require('./utilisateurs')

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
        service: { type: 'string' },
        site: { type: 'string' },
        email: { type: 'string' },
        telephone: { type: 'string' },
        adresse_1: { type: 'string' },
        adresse_2: { type: 'string' },
        code_postal: { type: 'integer' },
        ville: { type: 'string' },
        cedex: { type: 'integer' }
      }
    }
  }

  static get relationMappings() {
    return {
      utilisateurs: {
        relation: Model.HasManyRelation,
        modelClass: Utilisateurs,
        join: {
          from: 'administrations.id',
          to: 'utilisateurs.administrationId'
        }
      }
    }
  }
}

module.exports = Administrations
