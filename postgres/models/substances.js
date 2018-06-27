const { Model } = require('objection')
const SubstanceLegals = require('./substances-legals')
const Domaines = require('./domaines')

class Substances extends Model {
  static get tableName() {
    return 'substances'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'id',
        'nom',
        'domaine_id',
        'type',
        'usage',
        'substance_legal_id'
      ],

      properties: {
        id: { type: 'string' },
        nom: { type: 'string' },
        domaine_id: { type: 'string' },
        type: { type: 'string' },
        usage: { type: 'string' },
        symbole: { type: 'string' },
        alias: {
          type: 'array',
          properties: { type: 'string' }
        },
        gerep: { type: ['integer', 'null'] },
        description: { type: 'string', maxLength: 2048 },
        substance_legal_id: { type: 'string' }
      }
    }
  }

  static get relationMappings() {
    return {
      legal: {
        relation: Model.BelongsToOneRelation,
        modelClass: SubstanceLegals,
        join: {
          from: 'substances.substance_legal_id',
          to: 'substances_legals.id'
        }
      },
      domaine: {
        relation: Model.BelongsToOneRelation,
        modelClass: Domaines,
        join: {
          from: 'substances.domaine_id',
          to: 'domaines.id'
        }
      }
    }
  }
}

module.exports = Substances
