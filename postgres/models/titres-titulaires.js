const { Model } = require('objection')
const Entreprises = require('./entreprises')

class TitresTitulaires extends Model {
  static get tableName() {
    return 'titresTitulaires'
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
          from: 'titresTitulaires.entrepriseId',
          to: 'entreprises.id'
        }
      }
    }
  }
}

module.exports = TitresTitulaires
