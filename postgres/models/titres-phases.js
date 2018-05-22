const { Model } = require('objection')
const Emprises = require('./titres-emprises')
const titresTypesPhases = require('./titres-types-phases')

class Phases extends Model {
  static get tableName() {
    return 'titresPhases'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'titreId'],

      properties: {
        id: { type: 'string', maxLength: 128 },
        titreId: { type: 'string', maxLength: 128 },
        phaseId: { type: 'string', maxLength: 8 },
        date: { type: 'string' },
        duree: { type: 'integer' },
        surface: { type: 'integer' },
        position: { type: 'integer' }
      }
    }
  }

  static get relationMappings() {
    return {
      emprise: {
        relation: Model.ManyToManyRelation,
        modelClass: Emprises,
        join: {
          from: 'titresPhases.id',
          through: {
            from: 'titresPhasesEmprises.phaseId',
            to: 'titresPhasesEmprises.empriseId'
          },
          to: 'titresEmprises.id'
        }
      },
      type: {
        relation: Model.BelongsToOneRelation,
        modelClass: titresTypesPhases,
        join: {
          from: 'titresPhases.phaseId',
          to: 'titresTypesPhases.id'
        }
      }
    }
  }
}

module.exports = Phases
