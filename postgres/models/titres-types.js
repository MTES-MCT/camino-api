const { Model } = require('objection')
const Phases = require('./titres-types-phases')

class Types extends Model {
  static get tableName() {
    return 'titresTypes'
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
      phases: {
        relation: Model.HasManyRelation,
        modelClass: Phases,
        join: {
          from: 'titresTypes.id',
          to: 'titresTypesPhases.typeId'
        }
      }
    }
  }
}

module.exports = Types
