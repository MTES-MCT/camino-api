const { Model } = require('objection')
const Entreprises = require('./entreprises')

class TitresAmodiataires extends Model {
  static get tableName() {
    return 'titresAmodiataires'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['entrepriseId', 'titre_etapeId'],

      properties: {
        entreprise_id: { type: 'string', maxLength: 64 },
        titre_etape_id: { type: 'string', maxLength: 128 }
      }
    }
  }

  static get relationMappings() {
    return {
      entreprise: {
        relation: Model.BelongsToOneRelation,
        modelClass: Entreprises,
        join: {
          from: 'titresAmodiataires.entrepriseId',
          to: 'entreprises.id'
        }
      }
    }
  }
}

module.exports = TitresAmodiataires
