const { Model } = require('objection')
const Demarches = require('./demarches')

class Types extends Model {
  static get tableName() {
    return 'types'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'nom'],

      properties: {
        id: { type: 'string', maxLength: 3 },
        nom: { type: 'string' }
      }
    }
  }

  static get relationMappings() {
    return {
      demarches: {
        relation: Model.HasManyRelation,
        modelClass: Demarches,
        join: {
          from: 'types.id',
          to: 'demarche.type_id'
        }
      }
    }
  }
}

module.exports = Types
