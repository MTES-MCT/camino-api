const { Model } = require('objection')
const Substances = require('./substances')

class TitresSubstances extends Model {
  static get tableName() {
    return 'titres_substances'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['substance_id', 'titre_etape_id'],

      properties: {
        substance_id: { type: 'string', maxLength: 4 },
        titre_etape_id: { type: 'string', maxLength: 128 },
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
          from: 'titres_substances.substance_id',
          to: 'substances.id'
        }
      }
    }
  }
}

module.exports = TitresSubstances
