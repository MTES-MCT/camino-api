const { Model } = require('objection')
const EtapesStatuts = require('./etapes-statuts')

class EtapesTypes extends Model {
  static get tableName() {
    return 'etapesTypes'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'nom'],

      properties: {
        id: { type: 'string', maxLength: 3 },
        nom: {
          type: 'string',
          maxLength: 128
        },
        acceptationAuto: {
          type: 'boolean'
        },
        dateDebut: {
          type: 'date'
        },
        dateFin: {
          type: 'date'
        }
      }
    }
  }

  static get relationMappings() {
    return {
      statuts: {
        relation: Model.ManyToManyRelation,
        modelClass: EtapesStatuts,
        join: {
          from: 'etapesTypes.id',
          through: {
            from: 'etapesTypes__etapesStatuts.etapeTypeId',
            to: 'etapesTypes__etapesStatuts.etapeStatutId',
            extra: ['ordre']
          },
          to: 'etapesStatuts.id'
        }
      }
    }
  }
}

module.exports = EtapesTypes
