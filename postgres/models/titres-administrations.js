const { Model } = require('objection')
const Administrations = require('./administrations')

class TitresAdministrations extends Model {
  static get tableName() {
    return 'titres_administrations'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['administration_id', 'titre_demarche_etape_id'],

      properties: {
        administration_id: { type: 'string', maxLength: 64 },
        titre_demarche_etape_id: { type: 'string', maxLength: 128 }
      }
    }
  }

  static get relationMappings() {
    return {
      substance: {
        relation: Model.BelongsToOneRelation,
        modelClass: Administrations,
        join: {
          from: 'titres_administrations.administration_id',
          to: 'administrations.id'
        }
      }
    }
  }
}

module.exports = TitresAdministrations
