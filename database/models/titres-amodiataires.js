const { Model } = require('objection')
const Entreprises = require('./entreprises')

class TitresAmodiataires extends Model {
  static get tableName() {
    return 'titresAmodiataires'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['entrepriseId', 'titreEtapeId'],

      properties: {
        entrepriseId: { type: 'string', maxLength: 64 },
        titreEtapeId: { type: 'string', maxLength: 128 }
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

  static get idColumn() {
    return ['entrepriseId', 'titreEtapeId']
  }
}

module.exports = TitresAmodiataires
