const { Model } = require('objection')
const Demarches = require('./demarches')
const DemarchesStatuts = require('./demarches-statuts')
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
        demarcheId: { type: 'string', maxLength: 8 },
        statutId: { type: 'string', maxLength: 3 },
        ordre: { type: 'integer' }
      }
    }
  }

  static get relationMappings() {
    return {
      type: {
        relation: Model.BelongsToOneRelation,
        modelClass: Demarches,
        join: {
          from: 'titresDemarches.demarcheId',
          to: 'demarches.id'
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
      statut: {
        relation: Model.BelongsToOneRelation,
        modelClass: DemarchesStatuts,
        join: {
          from: 'titresDemarches.demarcheStatutId',
          to: 'demarchesStatuts.id'
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
}

module.exports = TitresDemarches
