const { Model } = require('objection')
const Emprises = require('./emprises')

class TitresEmprises extends Model {
  static get tableName() {
    return 'titresEmprises'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['empriseId', 'titreEtapeId'],

      properties: {
        empriseId: { type: 'string', maxLength: 3 },
        titreEtapeId: { type: 'string', maxLength: 128 }
      }
    }
  }

  static get relationMappings() {
    return {
      emprise: {
        relation: Model.BelongsToOneRelation,
        modelClass: Emprises,
        join: {
          from: 'titresEmprises.empriseId',
          to: 'emprises.id'
        }
      }
    }
  }

  static get idColumn() {
    return ['empriseId', 'titreEtapeId']
  }
}

module.exports = TitresEmprises
