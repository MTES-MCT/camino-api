const { Model } = require('objection')
const Domaines = require('./titres-domaines')
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
      domaine: {
        relation: Model.ManyToManyRelation,
        modelClass: Domaines,
        join: {
          from: 'titresTypes.id',
          through: {
            from: 'titresDomainesTypes.typeId',
            to: 'titresDomainesTypes.domaineId'
          },
          to: 'titresDomaines.id'
        }
      },
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
