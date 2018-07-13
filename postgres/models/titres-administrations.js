const { Model } = require('objection')
const Administrations = require('./administrations')

class TitresAdministrations extends Model {
  static get tableName() {
    return 'titresAdministrations'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['administrationId', 'titre_etapeId'],

      properties: {
        administration_id: { type: 'string', maxLength: 64 },
        titre_etape_id: { type: 'string', maxLength: 128 }
      }
    }
  }

  static get relationMappings() {
    return {
      substance: {
        relation: Model.BelongsToOneRelation,
        modelClass: Administrations,
        join: {
          from: 'titresAdministrations.administrationId',
          to: 'administrations.id'
        }
      }
    }
  }
}

module.exports = TitresAdministrations
