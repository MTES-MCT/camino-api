import { Model } from 'objection'
import EtapesTypes from './etapes-types'
import EtapesStatuts from './etapes-statuts'
import Substances from './substances'
import TitresPoints from './titres-points'
import Entreprises from './entreprises'
import Administrations from './administrations'
import TitresDocuments from './titres-documents'
import Emprises from './emprises'
import Communes from './communes'
import TitresErreurs from './titres-erreurs'
import Devises from './devises'
import VolumeUnites from './volume-unites'

// import TitresSubstances from './titres-substances'
// import TitresAdministrations from './titres-administrations'
// import TitresTitulaires from './titres-titulaires'
// import TitresAmodiataires from './titres-amodiataires'
// import TitresEmprises from './titres-emprises'

export default class TitresEtapes extends Model {
  static tableName = 'titresEtapes'

  static jsonSchema = {
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
      surface: { type: ['number', 'null'] },
      volume: { type: ['number', 'null'] },
      volumeUniteId: { type: ['string', 'null'] },
      visas: { type: ['array', 'null'] },
      engagement: { type: ['number', 'null'] },
      engagementDeviseId: { type: ['string', 'null'] },
      sourceIndisponible: { type: ['boolean', 'null'] }
    }
  }

  static relationMappings = {
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
          to: 'titresTitulaires.entrepriseId',
          extra: ['operateur']
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
          to: 'titresAmodiataires.entrepriseId',
          extra: ['operateur']
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
          to: 'titresAdministrations.administrationId',
          extra: ['coordinateur']
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

    communes: {
      relation: Model.ManyToManyRelation,
      modelClass: Communes,
      join: {
        from: 'titresEtapes.id',
        through: {
          from: 'titresCommunes.titreEtapeId',
          to: 'titresCommunes.communeId'
        },
        to: 'communes.id'
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

    volumeUnite: {
      relation: Model.BelongsToOneRelation,
      modelClass: VolumeUnites,
      join: {
        from: 'titresEtapes.volumeUniteId',
        to: 'volumeUnites.id'
      }
    },

    engagementDevise: {
      relation: Model.BelongsToOneRelation,
      modelClass: Devises,
      join: {
        from: 'titresEtapes.engagementDeviseId',
        to: 'devises.id'
      }
    }

    /*
    // relations pour exporter les tables de jointures
    // via /tools/exports
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
    */
  }

  $parseJson(json) {
    if (json.administrationsIds) {
      json.administrations = json.administrationsIds.map(id => ({ id }))
      delete json.administrationsIds
    }

    if (json.amodiatairesIds) {
      json.amodiataires = json.amodiatairesIds.map(id => ({ id }))
      delete json.amodiatairesIds
    }

    if (json.titulairesIds) {
      json.titulaires = json.titulairesIds.map(id => ({ id }))
      delete json.titulairesIds
    }

    if (json.substancesIds) {
      json.substances = json.substancesIds.map(id => ({ id }))
      delete json.substancesIds
    }

    json = super.$parseJson(json)
    return json
  }

  static namedFilters = {
    orderDesc: builder => {
      builder.orderBy('ordre', 'desc')
    }
  }

  // nécessaire lorsqu'on insère un tableau de 'visas'
  static jsonAttributes = []
}
