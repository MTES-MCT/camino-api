const { Model } = require('objection')
const Etapes = require('./etapes')
const EtapesStatuts = require('./etapes-statuts')
const Substances = require('./substances')
const TitresPoints = require('./titres-points')
const Entreprises = require('./entreprises')
const Utilisateurs = require('./utilisateurs')
const TitresAdministrations = require('./titres-administrations')
const TitresDocuments = require('./titres-documents')
const TitresEmprises = require('./titres-emprises')
const TitresErreurs = require('./titres-erreurs')

class TitresEtapes extends Model {
  static get tableName() {
    return 'titresEtapes'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'titreDemarcheId'],

      properties: {
        id: { type: 'string', maxLength: 128 },
        titreDemarcheId: { type: 'string', maxLength: 128 },
        etapeId: { type: 'string', maxLength: 3 },
        etapeStatutId: { type: 'string', maxLength: 3 },
        date: { type: 'date' },
        duree: { type: 'integer' },
        dateDebut: { type: 'date' },
        dateFin: { type: 'date' },
        surface: { type: 'integer' },
        visas: { type: 'json' },
        ordre: { type: 'integer' },
        engagement: { type: 'integer' },
        engagementDevise: { type: 'string' }
      }
    }
  }

  static get relationMappings() {
    return {
      type: {
        relation: Model.BelongsToOneRelation,
        modelClass: Etapes,
        join: {
          from: 'titresEtapes.etapeId',
          to: 'etapes.id'
        }
      },
      statut: {
        relation: Model.BelongsToOneRelation,
        modelClass: EtapesStatuts,
        join: {
          from: 'titresEtapes.etapeStatutId',
          to: 'etapesStatuts.id'
        }
      },
      substances: {
        relation: Model.ManyToManyRelation,
        modelClass: Substances,
        join: {
          from: 'titresEtapes.id',
          through: {
            from: 'titresSubstances.titreEtapeId',
            to: 'titresSubstances.substanceId',
            extra: ['ordre', 'connexe']
          },
          to: 'substances.id'
        }
      },
      points: {
        relation: Model.HasManyRelation,
        modelClass: TitresPoints,
        join: {
          from: 'titresEtapes.id',
          to: 'titresPoints.titreEtapeId'
        }
      },
      titulaires: {
        relation: Model.ManyToManyRelation,
        modelClass: Entreprises,
        join: {
          from: 'titresEtapes.id',
          through: {
            from: 'titresTitulaires.titreEtapeId',
            to: 'titresTitulaires.entrepriseId'
          },
          to: 'entreprises.id'
        }
      },
      amodiataires: {
        relation: Model.ManyToManyRelation,
        modelClass: Entreprises,
        join: {
          from: 'titresEtapes.id',
          through: {
            from: 'titresAmodiataires.titreEtapeId',
            to: 'titresAmodiataires.entrepriseId'
          },
          to: 'entreprises.id'
        }
      },
      utilisateurs: {
        relation: Model.ManyToManyRelation,
        modelClass: Utilisateurs,
        join: {
          from: 'titresEtapes.id',
          through: {
            from: 'titresUtilisateurs.titreEtapeId',
            to: 'titresUtilisateurs.utilisateurId'
          },
          to: 'utilisateurs.id'
        }
      },
      administrations: {
        relation: Model.HasManyRelation,
        modelClass: TitresAdministrations,
        join: {
          from: 'titresEtapes.id',
          to: 'titresAdministrations.titreEtapeId'
        }
      },
      documents: {
        relation: Model.HasManyRelation,
        modelClass: TitresDocuments,
        join: {
          from: 'titresEtapes.id',
          to: 'titresDocuments.titreEtapeId'
        }
      },
      emprises: {
        relation: Model.HasManyRelation,
        modelClass: TitresEmprises,
        join: {
          from: 'titresEtapes.id',
          to: 'titresEmprises.titreEtapeId'
        }
      },
      erreurs: {
        relation: Model.BelongsToOneRelation,
        modelClass: TitresErreurs,
        join: {
          from: 'titresEtapes.id',
          to: 'titresErreurs.titreEtapeId'
        }
      }
    }
  }
}

module.exports = TitresEtapes
