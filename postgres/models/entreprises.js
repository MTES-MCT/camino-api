const { Model } = require('objection')
const Utilisateurs = require('./utilisateurs')

class Entreprises extends Model {
  static get tableName() {
    return 'entreprises'
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
        adresse1: { type: 'string' },
        adresse2: { type: 'string' },
        codePostal: { type: 'integer' },
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
          from: 'entreprises.id',
          to: 'utilisateurs.entreprise_id'
        }
      }
    }
  }
}

module.exports = Entreprises
