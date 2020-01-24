import { Model, Modifiers, Pojo, QueryContext } from 'objection'
import { paysFormat } from './_format'
import Administrations from './administrations'
import Communes from './communes'
import Devises from './devises'
import Entreprises from './entreprises'
import EtapesStatuts from './etapes-statuts'
import EtapesTypes from './etapes-types'
import Pays from './pays'
import Substances from './substances'
import TitresDocuments from './titres-documents'
import TitresIncertitudes from './titres-incertitudes'
import TitresPoints from './titres-points'
import Unites from './unites'

export default class TitresEtapes extends Model {
  public static tableName = 'titresEtapes'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'titreDemarcheId', 'date'],

    properties: {
      id: { type: 'string', maxLength: 128 },
      titreDemarcheId: { type: 'string', maxLength: 128 },
      date: { type: ['string', 'null'] },
      typeId: { type: 'string', maxLength: 3 },
      statutId: { type: 'string', maxLength: 3 },
      ordre: { type: 'integer' },
      dateDebut: { type: ['string', 'null'] },
      dateFin: { type: ['string', 'null'] },
      duree: { type: ['integer', 'null'] },
      surface: { type: ['number', 'null'] },
      volume: { type: ['number', 'null'] },
      volumeUniteId: { type: ['string', 'null'] },
      engagement: { type: ['number', 'null'] },
      engagementDeviseId: { type: ['string', 'null'] },
      contenu: { type: 'json' }
    }
  }

  public static relationMappings = {
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
          from: 'titresAdministrationsLocales.titreEtapeId',
          to: 'titresAdministrationsLocales.administrationId',
          extra: ['associee', 'coordinateur']
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

    communes: {
      relation: Model.ManyToManyRelation,
      modelClass: Communes,
      join: {
        from: 'titresEtapes.id',
        through: {
          from: 'titresCommunes.titreEtapeId',
          to: 'titresCommunes.communeId',
          extra: ['surface']
        },
        to: 'communes.id'
      }
    },

    incertitudes: {
      relation: Model.HasOneRelation,
      modelClass: TitresIncertitudes,
      join: {
        from: 'titresEtapes.id',
        to: 'titresIncertitudes.titreEtapeId'
      }
    },

    volumeUnite: {
      relation: Model.BelongsToOneRelation,
      modelClass: Unites,
      join: {
        from: 'titresEtapes.volumeUniteId',
        to: 'unites.id'
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

  public static modifiers: Modifiers = {
    orderDesc: builder => {
      builder.orderBy('ordre', 'desc')
    }
  }

  public id!: string
  public titreDemarcheId!: string
  public typeId!: string
  public statutId!: string
  public ordre?: number
  public date!: string
  public dateDebut?: string
  public dateFin?: string
  public duree?: number
  public surface?: number
  public volume?: number
  public volumeUniteId?: string
  public engagement?: number
  public engagementDeviseId?: string
  // TODO: ITitresEtapesContenus
  public contenu?: any
  public type!: EtapesTypes
  public statut!: EtapesStatuts
  public substances?: Substances
  public points?: TitresPoints
  public titulaires?: Entreprises
  public amodiataires?: Entreprises
  public administrations?: Administrations
  public documents?: TitresDocuments
  public communes?: Communes
  public incertitudes?: TitresIncertitudes
  public volumeUnite?: Unites
  public engagementDevise?: Devises
  public pays?: Pays[]

  public $afterGet() {
    this.pays = paysFormat(this.communes)
  }

  public $formatDatabaseJson(json) {
    if (this.pays) {
      delete this.pays
    }

    return super.$formatDatabaseJson(json)
  }

  public $parseJson(json: Pojo) {
    json = super.$parseJson(json)

    if (!json.id && json.titreDemarcheId && json.typeId) {
      json.id = `${json.titreDemarcheId}-${json.typeId}99`
    }

    if (json.points) {
      json.points.forEach((point: TitresPoints) => {
        point.titreEtapeId = json.id
      })
    }

    if (json.administrationsIds) {
      json.administrations = json.administrationsIds.map((id: string) => ({
        id
      }))
      delete json.administrationsIds
    }

    if (json.amodiatairesIds) {
      json.amodiataires = json.amodiatairesIds.map((id: string) => ({
        id
      }))
      delete json.amodiatairesIds
    }

    if (json.titulairesIds) {
      json.titulaires = json.titulairesIds.map((id: string) => ({
        id
      }))
      delete json.titulairesIds
    }

    if (json.substancesIds) {
      json.substances = json.substancesIds.map((id: string) => ({
        id
      }))
      delete json.substancesIds
    }

    if (json.incertitudes && !json.incertitudes.titreEtapeId) {
      json.incertitudes.titreEtapeId = json.id
    }

    delete json.geojsonMultiPolygon
    delete json.geojsonPoints

    return json
  }
}
