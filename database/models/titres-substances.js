const { Model } = require('objection')
const Substances = require('./substances')

class TitresSubstances extends Model {
  static get tableName() {
    return 'titresSubstances'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['substanceId', 'titreEtapeId'],

      properties: {
        substanceId: { type: 'string', maxLength: 4 },
        titreEtapeId: { type: 'string', maxLength: 128 },
        connexe: { type: 'boolean' },
        ordre: { type: 'integer' }
      }
    }
  }

  static get relationMappings() {
    return {
      substance: {
        relation: Model.BelongsToOneRelation,
        modelClass: Substances,
        join: {
          from: 'titresSubstances.substanceId',
          to: 'substances.id'
        }
      }
    }
  }

  static get idColumn() {
    return ['substanceId', 'titreEtapeId']
  }
}

module.exports = TitresSubstances
