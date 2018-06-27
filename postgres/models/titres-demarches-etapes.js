const { Model } = require('objection')
const Etapes = require('./etapes')
const EtapesStatuts = require('./etapes-statuts')
const titresSubstances = require('./titres-substances')
const titresPoints = require('./titres-points')
const titresTitulaires = require('./titres-titulaires')
const titresAmodiataires = require('./titres-amodiataires')
const titresUtilisateurs = require('./titres-utilisateurs')
const titresAdministrations = require('./titres-administrations')
const titresDocuments = require('./titres-documents')
const titresEmprises = require('./titres-emprises')

class Phases extends Model {
  static get tableName() {
    return 'titres_demarches_etapes'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'titreId'],

      properties: {
        id: { type: 'string', maxLength: 128 },
        titre_demarche_id: { type: 'string', maxLength: 128 },
        etape_id: { type: 'string', maxLength: 3 },
        etape_statut_id: { type: 'string', maxLength: 3 },
        ordre: { type: 'integer' },
        date: { type: 'date' },
        duree: { type: 'integer' },
        surface: { type: 'integer' }
      }
    }
  }

  static get relationMappings() {
    return {
      etape: {
        relation: Model.BelongsToOneRelation,
        modelClass: Etapes,
        join: {
          from: 'titres_demarches_etapes.etape_id',
          to: 'etapes.id'
        }
      },
      etape_statut: {
        relation: Model.BelongsToOneRelation,
        modelClass: EtapesStatuts,
        join: {
          from: 'titres_demarches_etapes.etape_statut_id',
          to: 'etapes_statuts.id'
        }
      },
      substances: {
        relation: Model.HasManyRelation,
        modelClass: titresSubstances,
        join: {
          from: 'titres_demarches_etapes.id',
          to: 'titres_substances.titre_demarche_etape_id'
        }
      },
      points: {
        relation: Model.HasManyRelation,
        modelClass: titresPoints,
        join: {
          from: 'titres_demarches_etapes.id',
          to: 'titres_points.titre_demarche_etape_id'
        }
      },
      titulaires: {
        relation: Model.HasManyRelation,
        modelClass: titresTitulaires,
        join: {
          from: 'titres_demarches_etapes.id',
          to: 'titres_titulaires.titre_demarche_etape_id'
        }
      },
      amodiataires: {
        relation: Model.HasManyRelation,
        modelClass: titresAmodiataires,
        join: {
          from: 'titres_demarches_etapes.id',
          to: 'titres_amodiataires.titre_demarche_etape_id'
        }
      },
      utilisateurs: {
        relation: Model.HasManyRelation,
        modelClass: titresUtilisateurs,
        join: {
          from: 'titres_demarches_etapes.id',
          to: 'titres_utilisateurs.titre_demarche_etape_id'
        }
      },
      administrations: {
        relation: Model.HasManyRelation,
        modelClass: titresAdministrations,
        join: {
          from: 'titres_demarches_etapes.id',
          to: 'titres_administrations.titre_demarche_etape_id'
        }
      },
      documents: {
        relation: Model.HasManyRelation,
        modelClass: titresDocuments,
        join: {
          from: 'titres_demarches_etapes.id',
          to: 'titres_documents.titre_demarche_etape_id'
        }
      },
      emprises: {
        relation: Model.HasManyRelation,
        modelClass: titresEmprises,
        join: {
          from: 'titres_demarches_etapes.id',
          to: 'titres_emprises.titre_demarche_etape_id'
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

module.exports = Phases
