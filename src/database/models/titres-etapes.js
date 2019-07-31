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
import titresIncertitudes from './titres-incertitudes'
import Devises from './devises'
import VolumeUnites from './volume-unites'

export default class TitresEtapes extends Model {
  static tableName = 'titresEtapes'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'titreDemarcheId', 'date'],

    properties: {
      id: { type: 'string', maxLength: 128 },
      titreDemarcheId: { type: 'string', maxLength: 128 },
      typeId: { type: 'string', maxLength: 3 },
      statutId: { type: 'string', maxLength: 3 },
      ordre: { type: 'integer' },
      date: { type: 'date' },
      dateDebut: { type: 'date' },
      dateFin: { type: 'date' },
      duree: { type: ['integer', 'null'] },
      surface: { type: ['number', 'null'] },
      volume: { type: ['number', 'null'] },
      volumeUniteId: { type: ['string', 'null'] },
      visas: { type: ['array', 'null'] },
      engagement: { type: ['number', 'null'] },
      engagementDeviseId: { type: ['string', 'null'] },
      contenu: { type: 'json' }
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

    incertitudes: {
      relation: Model.HasOneRelation,
      modelClass: titresIncertitudes,
      join: {
        from: 'titresEtapes.id',
        to: 'titresIncertitudes.titreEtapeId'
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
  }

  $parseJson(json) {
    json = super.$parseJson(json)

    if (!json.id && json.titreDemarcheId && json.typeId) {
      json.id = `${json.titreDemarcheId}-${json.typeId}99`
    }

    if (json.points) {
      json.points.forEach(point => {
        point.titreEtapeId = json.id
      })
    }

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

    if (json.incertitudes && !json.incertitudes.titreEtapeId) {
      json.incertitudes.titreEtapeId = json.id
    }

    delete json.geojsonMultiPolygon
    delete json.geojsonPoints

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
