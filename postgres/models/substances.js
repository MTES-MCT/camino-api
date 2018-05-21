const { Model } = require('objection')
const SubstanceLegals = require('./substances-legals')

class Substances extends Model {
  static get tableName() {
    return 'substances'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'nom', 'domaine', 'type', 'usage', 'legalId'],

      properties: {
        id: { type: 'string' },
        nom: { type: 'string' },
        domaine: { type: 'string' },
        type: { type: 'string' },
        usage: { type: 'string' },
        symbole: { type: 'string' },
        alias: {
          type: 'array',
          properties: { type: 'string' }
        },
        gerep: { type: ['integer', 'null'] },
        description: { type: 'string', maxLength: 2048 },
        legalId: { type: 'string' }
      }
    }
  }

  static get relationMappings() {
    return {
      legal: {
        relation: Model.BelongsToOneRelation,
        modelClass: SubstanceLegals,
        join: {
          from: 'substances.legalId',
          to: 'substancesLegals.id'
        }
      }
    }
  }
}

module.exports = Substances
