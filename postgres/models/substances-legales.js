const { Model } = require('objection')
const SubstancesLegalesCodes = require('./substances-legales-codes')
const Domaines = require('./domaines')

class SubstancesLegales extends Model {
  static get tableName() {
    return 'substancesLegales'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'nom', 'lien'],

      properties: {
        id: { type: 'string' },
        nom: { type: ['string', 'null'] },
        domaineId: { type: ['string', 'null'] },
        description: { type: ['string', 'null'] },
        substanceLegalCodeId: { type: ['string', 'null'] }
      }
    }
  }

  static get relationMappings() {
    return {
      code: {
        relation: Model.BelongsToOneRelation,
        modelClass: SubstancesLegalesCodes,
        join: {
          from: 'substancesLegales.substanceLegaleCodeId',
          to: 'substancesLegalesCodes.id'
        }
      },
      domaine: {
        relation: Model.BelongsToOneRelation,
        modelClass: Domaines,
        join: {
          from: 'substancesLegales.domaineId',
          to: 'domaines.id'
        }
      }
    }
  }
}

module.exports = SubstancesLegales
