const { Model } = require('objection')
const EtapesStatuts = require('./etapes-statuts')

class Etapes extends Model {
  static get tableName() {
    return 'etapes'
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
          from: 'etapes.id',
          through: {
            from: 'etapes__etapesStatuts.etapeId',
            to: 'etapes__etapesStatuts.etapeStatutId',
            extra: ['ordre']
          },
          to: 'etapesStatuts.id'
        }
      }
    }
  }
}

module.exports = Etapes
