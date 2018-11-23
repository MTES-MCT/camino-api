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
        service: { type: 'string' },
        site: { type: 'string' },
        email: { type: 'string' },
        telephone: { type: 'string' },
        adresse1: { type: 'string' },
        adresse2: { type: 'string' },
        code_postal: { type: 'integer' },
        ville: { type: 'string' },
        cedex: { type: 'integer' }
      }
    }
  }

  static get relationMappings() {
    // Utilisateurs est requis par Administrations
    // Administrations est requis par Utilisateurs
    // ce qui provoque une require loop
    // solutions to require loops http://vincit.github.io/objection.js/#relations
    const Utilisateurs = require('./utilisateurs')

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
