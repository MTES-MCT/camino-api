const { Model } = require('objection')
const SubstancesLegales = require('./substances-legales')

class Substances extends Model {
  static get tableName() {
    return 'substances'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'nom', 'domaineId', 'type', 'substanceLegaleId'],

      properties: {
        id: { type: 'string' },
        nom: { type: ['string', 'null'] },
        symbole: { type: ['string', 'null'] },
        gerep: { type: ['integer', 'null'] },
        description: { type: ['string', 'null'], maxLength: 2048 },
        substanceLegalId: { type: 'string' }
      }
    }
  }

  static get relationMappings() {
    return {
      legales: {
        relation: Model.ManyToManyRelation,
        modelClass: SubstancesLegales,
        join: {
          from: 'substances.id',
          through: {
            from: 'substances__substancesLegales.substanceId',
            to: 'substances__substancesLegales.substanceLegaleId'
          },
          to: 'substancesLegales.id'
        }
      }
    }
  }
}

module.exports = Substances
