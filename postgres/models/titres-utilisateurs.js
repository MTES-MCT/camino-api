const { Model } = require('objection')
const Utilisateurs = require('./utilisateurs')

class TitresUtilisateurs extends Model {
  static get tableName() {
    return 'titresUtilisateurs'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['utilisateurId', 'titre_etapeId'],

      properties: {
        utilisateurId: { type: 'string', maxLength: 64 },
        titre_etapeId: { type: 'string', maxLength: 128 }
      }
    }
  }

  static get relationMappings() {
    return {
      utilisateur: {
        relation: Model.BelongsToOneRelation,
        modelClass: Utilisateurs,
        join: {
          from: 'titresUtilisateurs.utilisateurId',
          to: 'utilisateurs.id'
        }
      }
    }
  }
}

module.exports = TitresUtilisateurs
