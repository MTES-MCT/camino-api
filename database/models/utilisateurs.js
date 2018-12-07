const { Model } = require('objection')
const Permissions = require('./permissions')

class Utilisateurs extends Model {
  static get tableName() {
    return 'utilisateurs'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'email', 'motDePasse'],

      properties: {
        id: { type: 'string', minLength: 1, maxLength: 64 },
        email: { type: 'string' },
        motDePasse: { type: 'string', minLength: 8, maxLength: 255 },
        nom: { type: ['string', 'null'] },
        prenom: { type: ['string', 'null'] },
        telephone_fixe: { type: ['string', 'null'] },
        telephone_mobile: { type: ['string', 'null'] },
        entrepriseId: { type: ['string', 'null'], maxLength: 64 },
        administrationId: { type: ['string', 'null'], maxLength: 64 },
        permissionId: { type: ['string', 'null'], maxLength: 12 },
        preferences: { type: ['json', 'null'] }
      }
    }
  }

  static get relationMappings() {
    const Administrations = require('./administrations')
    const Entreprises = require('./entreprises')
    return {
      permission: {
        relation: Model.BelongsToOneRelation,
        modelClass: Permissions,
        join: {
          from: 'utilisateurs.permissionId',
          to: 'permissions.id'
        }
        // modify: builder => builder.select('id')
      },
      administration: {
        relation: Model.BelongsToOneRelation,
        modelClass: Administrations,
        join: {
          from: 'utilisateurs.administrationId',
          to: 'administrations.id'
        }
      },
      entreprise: {
        relation: Model.BelongsToOneRelation,
        modelClass: Entreprises,
        join: {
          from: 'utilisateurs.entrepriseId',
          to: 'entreprises.id'
        }
      }
    }
  }
}

module.exports = Utilisateurs
