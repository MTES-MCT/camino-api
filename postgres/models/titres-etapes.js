const { Model } = require('objection')
const Etapes = require('./etapes')
const EtapesStatuts = require('./etapes-statuts')
const Substances = require('./substances')
const TitresPoints = require('./titres-points')
const Entreprises = require('./entreprises')
const Utilisateurs = require('./utilisateurs')
const titresAdministrations = require('./titres-administrations')
const titresDocuments = require('./titres-documents')
const titresEmprises = require('./titres-emprises')

class TitresEtapes extends Model {
  static get tableName() {
    return 'titres_etapes'
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
      type: {
        relation: Model.BelongsToOneRelation,
        modelClass: Etapes,
        join: {
          from: 'titres_etapes.etape_id',
          to: 'etapes.id'
        }
      },
      statut: {
        relation: Model.BelongsToOneRelation,
        modelClass: EtapesStatuts,
        join: {
          from: 'titres_etapes.etape_statut_id',
          to: 'etapes_statuts.id'
        }
      },
      substances: {
        relation: Model.ManyToManyRelation,
        modelClass: Substances,
        join: {
          from: 'titres_etapes.id',
          through: {
            from: 'titres_substances.titre_etape_id',
            to: 'titres_substances.substance_id',
            extra: ['ordre', 'connexe']
          },
          to: 'substances.id'
        }
      },
      points: {
        relation: Model.HasManyRelation,
        modelClass: TitresPoints,
        join: {
          from: 'titres_etapes.id',
          to: 'titres_points.titre_etape_id'
        }
      },
      titulaires: {
        relation: Model.ManyToManyRelation,
        modelClass: Entreprises,
        join: {
          from: 'titres_etapes.id',
          through: {
            from: 'titres_titulaires.titre_etape_id',
            to: 'titres_titulaires.entreprise_id'
          },
          to: 'entreprises.id'
        }
      },
      amodiataires: {
        relation: Model.ManyToManyRelation,
        modelClass: Entreprises,
        join: {
          from: 'titres_etapes.id',
          through: {
            from: 'titres_amodiataires.titre_etape_id',
            to: 'titres_amodiataires.entreprise_id'
          },
          to: 'entreprises.id'
        }
      },
      utilisateurs: {
        relation: Model.ManyToManyRelation,
        modelClass: Utilisateurs,
        join: {
          from: 'titres_etapes.id',
          through: {
            from: 'titres_utilisateurs.titre_etape_id',
            to: 'titres_utilisateurs.utilisateur_id'
          },
          to: 'utilisateurs.id'
        }
      },
      administrations: {
        relation: Model.HasManyRelation,
        modelClass: titresAdministrations,
        join: {
          from: 'titres_etapes.id',
          to: 'titres_administrations.titre_etape_id'
        }
      },
      documents: {
        relation: Model.HasManyRelation,
        modelClass: titresDocuments,
        join: {
          from: 'titres_etapes.id',
          to: 'titres_documents.titre_etape_id'
        }
      },
      emprises: {
        relation: Model.HasManyRelation,
        modelClass: titresEmprises,
        join: {
          from: 'titres_etapes.id',
          to: 'titres_emprises.titre_etape_id'
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

module.exports = TitresEtapes
