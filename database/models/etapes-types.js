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
          type: ['string', 'null'],
          maxLength: 128
        },
        acceptationAuto: {
          type: ['boolean', 'null']
        },
        dateDebut: {
          type: ['date', 'null']
        },
        dateFin: {
          type: ['date', 'null']
        }
      }
    }
  }

  static get relationMappings() {
    return {
      etapesStatuts: {
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
