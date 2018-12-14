const { Model } = require('objection')
const DemarchesTypes = require('./demarches-types')
const DemarchesStatuts = require('./demarches-statuts')
const TitresPhases = require('./titres-phases')
const TitresEtapes = require('./titres-etapes')

class TitresDemarches extends Model {
  static get tableName() {
    return 'titresDemarches'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'titreId'],

      properties: {
        id: { type: 'string', maxLength: 128 },
        titreId: { type: 'string', maxLength: 128 },
        typeId: { type: 'string', maxLength: 8 },
        statutId: { type: 'string', maxLength: 3 },
        ordre: { type: 'integer' },
        annulationDemarcheId: { type: 'string', maxLength: 128 }
      }
    }
  }

  static get relationMappings() {
    return {
      type: {
        relation: Model.BelongsToOneRelation,
        modelClass: DemarchesTypes,
        join: {
          from: 'titresDemarches.typeId',
          to: 'demarchesTypes.id'
        }
      },
      statut: {
        relation: Model.BelongsToOneRelation,
        modelClass: DemarchesStatuts,
        join: {
          from: 'titresDemarches.statutId',
          to: 'demarchesStatuts.id'
        }
      },
      phase: {
        relation: Model.BelongsToOneRelation,
        modelClass: TitresPhases,
        join: {
          from: 'titresDemarches.id',
          to: 'titresPhases.titreDemarcheId'
        }
      },
      etapes: {
        relation: Model.HasManyRelation,
        modelClass: TitresEtapes,
        join: {
          from: 'titresDemarches.id',
          to: 'titresEtapes.titreDemarcheId'
        }
      },
      annulationDemarche: {
        relation: Model.BelongsToOneRelation,
        modelClass: TitresDemarches,
        join: {
          from: 'titresDemarches.annulationDemarcheId',
          to: 'titresDemarches.id'
        }
      }
    }
  }

  // $parseDatabaseJson(json) {
  //   json = super.$parseDatabaseJson(json)
  //   if (json) {
  //     console.log('--------------->', json)
  //   }
  //   console.log('<---------------')
  //   return json
  // }

  static get namedFilters() {
    return {
      orderDesc: builder => {
        builder.orderBy('ordre', 'desc')
      }
    }
  }
}

module.exports = TitresDemarches
