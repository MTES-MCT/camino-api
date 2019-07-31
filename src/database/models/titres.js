import { Model } from 'objection'
import Domaines from './domaines'
import Types from './types'
import Statuts from './statuts'
import TitresDemarches from './titres-demarches'
import TitresEtapes from './titres-etapes'
import Substances from './substances'
import TitresPoints from './titres-points'
import Entreprises from './entreprises'
import Administrations from './administrations'
import Communes from './communes'
import TitresActivites from './titres-activites'
import VolumeUnites from './volume-unites'
import Devises from './devises'

export default class Titres extends Model {
  static tableName = 'titres'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'nom', 'domaineId', 'typeId'],
    properties: {
      id: { type: 'string' },
      nom: { type: 'string' },
      domaineId: { type: 'string', maxLength: 1 },
      typeId: { type: 'string', maxLength: 3 },
      statutId: { type: 'string', maxLength: 3 },
      references: { type: ['object', 'null'] },
      dateDebut: { type: 'date' },
      dateFin: { type: 'date' },
      dateDemande: { type: 'date' },
      activitesDeposees: { type: ['number', 'null'] },
      activitesEnConstruction: { type: ['number', 'null'] },
      activitesAbsentes: { type: ['number', 'null'] },
      substancesTitreEtapeId: { type: ['string', 'null'], maxLength: 128 },
      pointsTitreEtapeId: { type: ['string', 'null'], maxLength: 128 },
      titulairesTitreEtapeId: { type: ['string', 'null'], maxLength: 128 },
      amodiatairesTitreEtapeId: { type: ['string', 'null'], maxLength: 128 },
      administrationsTitreEtapeId: {
        type: ['string', 'null'],
        maxLength: 128
      },
      surfaceTitreEtapeId: { type: ['string', 'null'], maxLength: 128 },
      volumeTitreEtapeId: { type: ['string', 'null'], maxLength: 128 },
      volumeUniteIdTitreEtapeId: { type: ['string', 'null'], maxLength: 128 },
      communesTitreEtapeId: { type: ['string', 'null'], maxLength: 128 },
      engagementTitreEtapeId: { type: ['string', 'null'], maxLength: 128 },
      engagementDeviseIdTitreEtapeId: {
        type: ['string', 'null'],
        maxLength: 128
      }
    }
  }

  static relationMappings = {
    domaine: {
      relation: Model.BelongsToOneRelation,
      modelClass: Domaines,
      join: {
        from: 'titres.domaineId',
        to: 'domaines.id'
      }
    },

    type: {
      relation: Model.BelongsToOneRelation,
      modelClass: Types,
      join: {
        from: 'titres.typeId',
        to: 'types.id'
      }
    },

    statut: {
      relation: Model.BelongsToOneRelation,
      modelClass: Statuts,
      join: {
        from: 'titres.statutId',
        to: 'statuts.id'
      }
    },

    demarches: {
      relation: Model.HasManyRelation,
      modelClass: TitresDemarches,
      join: {
        from: 'titres.id',
        to: 'titresDemarches.titreId'
      }
    },

    surfaceEtape: {
      relation: Model.BelongsToOneRelation,
      modelClass: TitresEtapes,
      join: {
        from: 'titres.surfaceTitreEtapeId',
        to: 'titresEtapes.id'
      },
      modify: builder => builder.select('surface')
    },

    volumeEtape: {
      relation: Model.BelongsToOneRelation,
      modelClass: TitresEtapes,
      join: {
        from: 'titres.volumeTitreEtapeId',
        to: 'titresEtapes.id'
      },
      modify: builder => builder.select('volume')
    },

    volumeUnite: {
      relation: Model.HasOneThroughRelation,
      modelClass: VolumeUnites,
      join: {
        from: 'titres.volumeUniteIdTitreEtapeId',
        through: {
          from: 'titresEtapes.id',
          to: 'titresEtapes.volumeUniteId'
        },
        to: 'volumeUnites.id'
      }
    },

    engagementEtape: {
      relation: Model.BelongsToOneRelation,
      modelClass: TitresEtapes,
      join: {
        from: 'titres.engagementTitreEtapeId',
        to: 'titresEtapes.id'
      },
      modify: builder => builder.select('engagement')
    },

    engagementDevise: {
      relation: Model.HasOneThroughRelation,
      modelClass: Devises,
      join: {
        from: 'titres.engagementDeviseIdTitreEtapeId',
        through: {
          from: 'titresEtapes.id',
          to: 'titresEtapes.engagementDeviseId'
        },
        to: 'devises.id'
      }
    },

    substances: {
      relation: Model.ManyToManyRelation,
      modelClass: Substances,
      join: {
        from: 'titres.substancesTitreEtapeId',
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
        from: 'titres.pointsTitreEtapeId',
        to: 'titresPoints.titreEtapeId'
      }
    },

    titulaires: {
      relation: Model.ManyToManyRelation,
      modelClass: Entreprises,
      join: {
        from: 'titres.titulairesTitreEtapeId',
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
        from: 'titres.amodiatairesTitreEtapeId',
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
        from: 'titres.administrationsTitreEtapeId',
        through: {
          from: 'titresAdministrations.titreEtapeId',
          to: 'titresAdministrations.administrationId',
          extra: ['coordinateur']
        },
        to: 'administrations.id'
      }
    },

    communes: {
      relation: Model.ManyToManyRelation,
      modelClass: Communes,
      join: {
        from: 'titres.communesTitreEtapeId',
        through: {
          from: 'titresCommunes.titreEtapeId',
          to: 'titresCommunes.communeId'
        },
        to: 'communes.id'
      }
    },

    activites: {
      relation: Model.HasManyRelation,
      modelClass: TitresActivites,
      join: {
        from: 'titres.id',
        to: 'titresActivites.titreId'
      }
    }
  }

  static get jsonAttributes() {
    return []
  }

  $parseDatabaseJson(json) {
    json = super.$parseDatabaseJson(json)
    json.references =
      json.references &&
      Object.keys(json.references).map(r => ({
        type: r,
        valeur: json.references[r]
      }))

    return json
  }

  $parseJson(json) {
    json = super.$parseJson(json)

    if (!json.id && json.domaineId && json.typeId && json.nom) {
      json.id = `${json.domaineId}-${json.typeId}-${json.nom}-9999`
    }

    if (json.references) {
      json.references = json.references.reduce(
        (references, ref) =>
          Object.assign(references, {
            [ref.type]: ref.valeur
          }),
        {}
      )
    }

    delete json.geojsonMultiPolygon
    delete json.geojsonPoints
    delete json.pays
    delete json.engagement
    delete json.surface
    delete json.volume
    delete json.engagementEtape
    delete json.surfaceEtape
    delete json.volumeEtape

    return json
  }
}
