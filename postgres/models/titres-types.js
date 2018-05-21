const { Model } = require('objection')
const Domaine = require('./titres-domaines')
const Phases = require('./titres-types-phases')

class Types extends Model {
  static get tableName() {
    return 'titres_types'
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
        modelClass: Domaine,
        join: {
          from: 'titres_types.id',
          through: {
            from: 'titres_domaines_types.type_id',
            to: 'titres_domaines_types.domaine_id'
          },
          to: 'titres_domaines.id'
        }
      },
      phases: {
        relation: Model.HasManyRelation,
        modelClass: Phases,
        join: {
          from: 'titres_types.id',
          to: 'titres_types_phases.type_id'
        }
      }
    }
  }
}

module.exports = Types
