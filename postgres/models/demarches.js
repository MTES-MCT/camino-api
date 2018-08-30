const { Model } = require('objection')
const Types = require('./types')
const DemarchesStatuts = require('./demarches-statuts')
const Etapes = require('./etapes')

class Demarches extends Model {
  static get tableName() {
    return 'demarches'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'nom'],

      properties: {
        id: { type: 'string', maxLength: 8 },
        nom: {
          type: 'string'
        },
        ordre: {
          type: 'integer'
        },
        duree: {
          type: 'boolean'
        },
        points: {
          type: 'boolean'
        },
        substances: {
          type: 'boolean'
        },
        titulaires: {
          type: 'boolean'
        },
        renouvelable: {
          type: 'boolean'
        },
        exception: {
          type: 'boolean'
        }
      }
    }
  }

  static get relationMappings() {
    return {
      types: {
        relation: Model.ManyToManyRelation,
        modelClass: Types,
        join: {
          from: 'demarches.id',
          through: {
            from: 'demarches__types.demarcheId',
            to: 'demarches__types.typeId',
            extra: [
              'dureeMax',
              'acceptationImplicite',
              'delaiImplicite',
              'delaiRecours',
              'legalRef',
              'legalLien',
              'dateDebut',
              'dateFin'
            ]
          },
          to: 'types.id'
        }
      },
      statuts: {
        relation: Model.ManyToManyRelation,
        modelClass: DemarchesStatuts,
        join: {
          from: 'demarches.id',
          through: {
            from: 'demarches__demarchesStatuts.demarcheId',
            to: 'demarches__demarchesStatuts.demarcheStatutId',
            extra: ['ordre']
          },
          to: 'demarchesStatuts.id'
        }
      },
      etapes: {
        relation: Model.ManyToManyRelation,
        modelClass: Etapes,
        join: {
          from: 'demarches.id',
          through: {
            from: 'demarches__etapes.demarcheId',
            to: 'demarches__etapes.etapeId',
            extra: ['ordre', 'typeId']
          },
          to: 'etapes.id'
        }
      }
    }
  }
}

module.exports = Demarches
