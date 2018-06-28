const { Model } = require('objection')
const Utilisateurs = require('./utilisateurs')

class TitresUtilisateurs extends Model {
  static get tableName() {
    return 'titres_utilisateurs'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['utilisateur_id', 'titre_etape_id'],

      properties: {
        utilisateur_id: { type: 'string', maxLength: 64 },
        titre_etape_id: { type: 'string', maxLength: 128 }
      }
    }
  }

  static get relationMappings() {
    return {
      substance: {
        relation: Model.BelongsToOneRelation,
        modelClass: Utilisateurs,
        join: {
          from: 'titres_utilisateurs.utilisateur_id',
          to: 'utilisateurs.id'
        }
      }
    }
  }
}

module.exports = TitresUtilisateurs
