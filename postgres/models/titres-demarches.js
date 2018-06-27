const { Model } = require('objection')
const Demarches = require('./demarches')
const DemarchesStatuts = require('./demarches-statuts')
const TitresDemarchesEtapes = require('./titres-demarches-etapes')

class TitresDemarches extends Model {
  static get tableName() {
    return 'titres_demarches'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'titreId'],

      properties: {
        id: { type: 'string', maxLength: 128 },
        titre_id: { type: 'string', maxLength: 128 },
        demarche_id: { type: 'string', maxLength: 8 },
        statut_id: { type: 'string', maxLength: 3 },
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
          from: 'titres_demarches.demarche_id',
          to: 'demarches.id'
        }
      },
      etapes: {
        relation: Model.HasManyRelation,
        modelClass: TitresDemarchesEtapes,
        join: {
          from: 'titres_demarches.id',
          to: 'titres_demarches_etapes.titre_demarche_id'
        }
      },
      statut: {
        relation: Model.BelongsToOneRelation,
        modelClass: DemarchesStatuts,
        join: {
          from: 'titres_demarches.demarche_statut_id',
          to: 'demarches_statuts.id'
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
