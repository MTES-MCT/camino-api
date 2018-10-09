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
        id: { type: 'string', maxLength: 64 },
        email: { type: 'string' },
        motDePasse: { type: 'string' },
        nom: { type: 'string' },
        prenom: { type: 'string' },
        telephone_fixe: { type: 'string' },
        telephone_mobile: { type: 'string' },
        entrepriseId: { type: 'string', maxLength: 64 },
        administrationId: { type: 'string', maxLength: 64 }
      }
    }
  }

  static get relationMappings() {
    return {
      permissions: {
        relation: Model.ManyToManyRelation,
        modelClass: Permissions,
        join: {
          from: 'utilisateurs.id',
          through: {
            from: 'utilisateursPermissions.utilisateurId',
            to: 'utilisateursPermissions.permissionId'
          },
          to: 'permissions.id'
        }
        // modify: builder => builder.select('id')
      }
    }
  }
}

module.exports = Utilisateurs
