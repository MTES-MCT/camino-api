const { Model } = require('objection')
const Administrations = require('./administrations')

class TitresAdministrations extends Model {
  static get tableName() {
    return 'titresAdministrations'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['administrationId', 'titreEtapeId'],

      properties: {
        administrationId: { type: 'string', maxLength: 64 },
        titreEtapeId: { type: 'string', maxLength: 128 }
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

  static get idColumn() {
    return ['administrationId', 'titreEtapeId']
  }
}

module.exports = TitresAdministrations
