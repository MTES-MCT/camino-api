const { Model } = require('objection')
const EtapesTypes = require('./etapes-types')
const EtapesStatuts = require('./etapes-statuts')
const Substances = require('./substances')
const TitresPoints = require('./titres-points')
const Entreprises = require('./entreprises')
const Administrations = require('./administrations')
const TitresDocuments = require('./titres-documents')
const Emprises = require('./emprises')
const TitresErreurs = require('./titres-erreurs')

const TitresSubstances = require('./titres-substances')
const TitresAdministrations = require('./titres-administrations')
const TitresTitulaires = require('./titres-titulaires')
const TitresAmodiataires = require('./titres-amodiataires')
const TitresEmprises = require('./titres-emprises')

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
        typeId: { type: 'string', maxLength: 3 },
        statutId: { type: 'string', maxLength: 3 },
        ordre: { type: 'integer' },
        date: { type: 'date' },
        duree: { type: ['integer', 'null'] },
        dateDebut: { type: 'date' },
        dateFin: { type: 'date' },
        surface: { type: 'float' },
        volume: { type: 'float' },
        volumeUnite: { type: ['string', 'null'] },
        visas: { type: ['json', 'null'] },
        engagement: { type: ['float', 'null'] },
        engagementDevise: { type: ['string', 'null'] },
        sourceIndisponible: { type: ['boolean', 'null'] }
      }
    }
  }

  static get relationMappings() {
    return {
      type: {
        relation: Model.BelongsToOneRelation,
        modelClass: EtapesTypes,
        join: {
          from: 'titresEtapes.typeId',
          to: 'etapesTypes.id'
        }
      },
      statut: {
        relation: Model.BelongsToOneRelation,
        modelClass: EtapesStatuts,
        join: {
          from: 'titresEtapes.statutId',
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
      administrations: {
        relation: Model.ManyToManyRelation,
        modelClass: Administrations,
        join: {
          from: 'titresEtapes.id',
          through: {
            from: 'titresAdministrations.titreEtapeId',
            to: 'titresAdministrations.administrationId'
          },
          to: 'administrations.id'
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
        relation: Model.ManyToManyRelation,
        modelClass: Emprises,
        join: {
          from: 'titresEtapes.id',
          through: {
            from: 'titresEmprises.titreEtapeId',
            to: 'titresEmprises.empriseId'
          },
          to: 'emprises.id'
        }
      },
      erreurs: {
        relation: Model.BelongsToOneRelation,
        modelClass: TitresErreurs,
        join: {
          from: 'titresEtapes.id',
          to: 'titresErreurs.titreEtapeId'
        }
      },
      titresSubstances: {
        relation: Model.HasManyRelation,
        modelClass: TitresSubstances,
        join: {
          from: 'titresEtapes.id',
          to: 'titresSubstances.titreEtapeId'
        }
      },
      titresTitulaires: {
        relation: Model.HasManyRelation,
        modelClass: TitresTitulaires,
        join: {
          from: 'titresEtapes.id',
          to: 'titresTitulaires.titreEtapeId'
        }
      },
      titresAmodiataires: {
        relation: Model.HasManyRelation,
        modelClass: TitresAmodiataires,
        join: {
          from: 'titresEtapes.id',
          to: 'titresAmodiataires.titreEtapeId'
        }
      },
      titresAdministrations: {
        relation: Model.HasManyRelation,
        modelClass: TitresAdministrations,
        join: {
          from: 'titresEtapes.id',
          to: 'titresAdministrations.titreEtapeId'
        }
      },
      titresEmprises: {
        relation: Model.HasManyRelation,
        modelClass: TitresEmprises,
        join: {
          from: 'titresEtapes.id',
          to: 'titresEmprises.titreEtapeId'
        }
      }
    }
  }

  static get namedFilters() {
    return {
      orderDesc: builder => {
        builder.orderBy('ordre', 'desc')
      }
    }
  }
}

module.exports = TitresEtapes
