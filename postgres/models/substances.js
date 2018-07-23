const { Model } = require('objection')
const SubstancesLegals = require('./substances-legals')

class Substances extends Model {
  static get tableName() {
    return 'substances'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'nom', 'domaineId', 'type', 'substanceLegalId'],

      properties: {
        id: { type: 'string' },
        nom: { type: 'string' },
        symbole: { type: 'string' },
        gerep: { type: ['integer', 'null'] },
        description: { type: 'string', maxLength: 2048 },
        substanceLegalId: { type: 'string' }
      }
    }
  }

  static get relationMappings() {
    return {
      legal: {
        relation: Model.BelongsToOneRelation,
        modelClass: SubstancesLegals,
        join: {
          from: 'substances.substanceLegalId',
          to: 'substancesLegals.id'
        }
      }
    }
  }
}

module.exports = Substances
