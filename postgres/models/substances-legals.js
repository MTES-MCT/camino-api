const { Model } = require('objection')
const SubstancesLegalsCodes = require('./substances-legals-codes')
const Domaines = require('./domaines')

class SubstancesLegals extends Model {
  static get tableName() {
    return 'substancesLegals'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'nom', 'lien'],

      properties: {
        id: { type: 'string' },
        nom: { type: 'string' },
        domaineId: { type: 'string' },
        description: { type: 'string' },
        substanceLegalCodeId: { type: 'string' }
      }
    }
  }

  static get relationMappings() {
    return {
      code: {
        relation: Model.BelongsToOneRelation,
        modelClass: SubstancesLegalsCodes,
        join: {
          from: 'substancesLegals.substanceLegalCodeId',
          to: 'substancesLegalsCodes.id'
        }
      },
      domaine: {
        relation: Model.BelongsToOneRelation,
        modelClass: Domaines,
        join: {
          from: 'substancesLegals.domaineId',
          to: 'domaines.id'
        }
      }
    }
  }
}

module.exports = SubstancesLegals
