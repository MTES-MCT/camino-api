import { Model, Modifiers, Pojo } from 'objection'
import { join } from 'path'
import { ITitreEtape, ITitrePoint } from '../../types'

import { paysFormat } from './_format'

interface TitresEtapes extends ITitreEtape {}

class TitresEtapes extends Model {
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
      contenu: { type: 'json' }
    }
  }

  public static relationMappings = {
    type: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'etapes-types'),
      join: {
        from: 'titresEtapes.typeId',
        to: 'etapesTypes.id'
      }
    },

    statut: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'etapes-statuts'),
      join: {
        from: 'titresEtapes.statutId',
        to: 'etapesStatuts.id'
      }
    },

    demarche: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'titres-demarches'),
      join: {
        from: 'titresEtapes.titreDemarcheId',
        to: 'titresDemarches.id'
      }
    },

    substances: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'substances'),
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
      modelClass: join(__dirname, 'titres-points'),
      join: {
        from: 'titresEtapes.id',
        to: 'titresPoints.titreEtapeId'
      }
    },

    titulaires: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'entreprises'),
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
      modelClass: join(__dirname, 'entreprises'),
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
      modelClass: join(__dirname, 'administrations'),
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
      modelClass: join(__dirname, 'documents'),
      join: {
        from: 'titresEtapes.id',
        to: 'documents.titreEtapeId'
      }
    },

    justificatifs: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'documents'),
      join: {
        from: 'titresEtapes.id',
        through: {
          from: 'titresEtapesJustificatifs.titreEtapeId',
          to: 'titresEtapesJustificatifs.documentId'
        },
        to: 'documents.id'
      }
    },

    communes: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'communes'),
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

    forets: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'forets'),
      join: {
        from: 'titresEtapes.id',
        through: {
          from: 'titresForets.titreEtapeId',
          to: 'titresForets.foretId',
          extra: ['surface']
        },
        to: 'forets.id'
      }
    },

    incertitudes: {
      relation: Model.HasOneRelation,
      modelClass: join(__dirname, 'titres-incertitudes'),
      join: {
        from: 'titresEtapes.id',
        to: 'titresIncertitudes.titreEtapeId'
      }
    }
  }

  public static modifiers: Modifiers = {
    orderDesc: builder => {
      builder.orderBy('ordre', 'desc')
    }
  }

  $afterFind() {
    this.pays = paysFormat(this.communes || [])

    return this
  }

  public $formatDatabaseJson(json: Pojo) {
    json = super.$formatDatabaseJson(json)

    if (json.pays) {
      delete json.pays
    }

    delete json.modification
    delete json.suppression
    delete json.justificatifsAssociation

    return json
  }

  public $parseJson(json: Pojo) {
    json = super.$parseJson(json)

    if (!json.id && json.titreDemarcheId && json.typeId) {
      json.id = `${json.titreDemarcheId}-${json.typeId}99`
    }

    if (json.points) {
      json.points.forEach((point: ITitrePoint) => {
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
      json.amodiataires = json.amodiatairesIds.map((id: string) => ({ id }))
      delete json.amodiatairesIds
    }

    if (json.titulairesIds) {
      json.titulaires = json.titulairesIds.map((id: string) => ({ id }))
      delete json.titulairesIds
    }

    if (json.substancesIds) {
      json.substances = json.substancesIds.map((id: string) => ({ id }))

      delete json.substancesIds
    }

    if (json.incertitudes && !json.incertitudes.titreEtapeId) {
      json.incertitudes.titreEtapeId = json.id
    }

    delete json.geojsonMultiPolygon
    delete json.geojsonPoints

    delete json.modification
    delete json.suppression
    delete json.justificatifsAssociation

    return json
  }
}

export default TitresEtapes
