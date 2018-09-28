const { Model } = require('objection')
const Groupes = require('./groupes')

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
      groupes: {
        relation: Model.ManyToManyRelation,
        modelClass: Groupes,
        join: {
          from: 'utilisateurs.id',
          through: {
            from: 'utilisateursGroupes.utilisateurId',
            to: 'utilisateursGroupes.groupeId'
          },
          to: 'groupes.id'
        }
      }
    }
  }
}

module.exports = Utilisateurs
