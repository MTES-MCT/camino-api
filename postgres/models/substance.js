const { Model } = require('objection')
const SubstanceLegal = require('./substances-legal')

class Substance extends Model {
  static get tableName() {
    return 'titres_substances'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'nom', 'domaine', 'type', 'usage', 'legal_id'],

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
        legal_id: { type: 'string' }
      }
    }
  }

  static get relationMappings() {
    return {
      legal: {
        relation: Model.BelongsToOneRelation,
        modelClass: SubstanceLegal,
        join: {
          from: 'titres_substances.legal_id',
          to: 'titres_substances_legals.id'
        }
      }
    }
  }
}

module.exports = Substance
