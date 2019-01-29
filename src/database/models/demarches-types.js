const { Model } = require('objection')
const DemarchesStatuts = require('./demarches-statuts')
const EtapesTypes = require('./etapes-types')

class DemarchesTypes extends Model {
  static get tableName() {
    return 'demarchesTypes'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'nom'],

      properties: {
        id: { type: 'string', maxLength: 3 },
        nom: { type: 'string' },
        ordre: { type: 'integer' },
        duree: { type: 'boolean' },
        points: { type: 'boolean' },
        substances: { type: 'boolean' },
        titulaires: { type: 'boolean' },
        renouvelable: { type: 'boolean' },
        exception: { type: 'boolean' }
      }
    }
  }

  static get relationMappings() {
    return {
      demarchesStatuts: {
        relation: Model.ManyToManyRelation,
        modelClass: DemarchesStatuts,
        join: {
          from: 'demarchesTypes.id',
          through: {
            from: 'demarchesTypes__demarchesStatuts.demarcheTypeId',
            to: 'demarchesTypes__demarchesStatuts.demarcheStatutId',
            extra: ['ordre']
          },
          to: 'demarchesStatuts.id'
        }
      },

      etapesTypes: {
        relation: Model.ManyToManyRelation,
        modelClass: EtapesTypes,
        join: {
          from: 'demarchesTypes.id',
          through: {
            from: 'demarchesTypes__etapesTypes.demarcheTypeId',
            to: 'demarchesTypes__etapesTypes.etapeTypeId',
            extra: ['ordre', 'typeId']
          },
          to: 'etapesTypes.id'
        }
      }
    }
  }
}

module.exports = DemarchesTypes
