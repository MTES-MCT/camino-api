import { Model, Modifiers, Pojo } from 'objection'
import { join } from 'path'
import { ITitreDemarche } from '../../types'

interface TitresDemarches extends ITitreDemarche {}

class TitresDemarches extends Model {
  public static tableName = 'titresDemarches'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'titreId', 'typeId'],

    properties: {
      id: { type: 'string', maxLength: 128 },
      titreId: { type: 'string', maxLength: 128 },
      typeId: { type: 'string', maxLength: 8 },
      statutId: { type: 'string', maxLength: 3 },
      ordre: { type: 'integer' },
      annulationTitreDemarcheId: {
        type: ['string', 'null'],
        maxLength: 128
      }
    }
  }

  public static relationMappings = {
    type: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'demarches-types'),
      join: {
        from: 'titresDemarches.typeId',
        to: 'demarchesTypes.id',
        extra: { titreId: 'titresDemarches.titreId' }
      }
    },

    statut: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'demarches-statuts'),
      join: {
        from: 'titresDemarches.statutId',
        to: 'demarchesStatuts.id'
      }
    },

    // todo: pourquoi ne pas utiliser la relation `titre` ?
    titreType: {
      relation: Model.HasOneThroughRelation,
      modelClass: join(__dirname, 'titres-types'),
      join: {
        from: 'titresDemarches.titreId',
        through: {
          from: 'titres.id',
          to: 'titres.typeId'
        },
        to: 'titresTypes.id'
      }
    },

    titre: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'titres'),
      join: {
        from: 'titresDemarches.titreId',
        to: 'titres.id'
      }
    },

    etapes: {
      relation: Model.HasManyRelation,
      modelClass: join(__dirname, 'titres-etapes'),
      join: {
        from: 'titresDemarches.id',
        to: 'titresEtapes.titreDemarcheId'
      }
    },

    phase: {
      relation: Model.HasOneRelation,
      modelClass: join(__dirname, 'titres-phases'),
      join: {
        from: 'titresDemarches.id',
        to: 'titresPhases.titreDemarcheId'
      }
    },

    annulationDemarche: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'titres-demarches'),
      join: {
        from: 'titresDemarches.annulationTitreDemarcheId',
        to: 'titresDemarches.id'
      }
    },

    parents: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'titres-demarches'),
      join: {
        from: 'titresDemarches.id',
        through: {
          from: 'titresDemarchesLiens.enfantTitreDemarcheId',
          to: 'titresDemarchesLiens.parentTitreDemarcheId'
        },
        to: 'titresDemarches.id'
      }
    },

    enfants: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'titres-demarches'),
      join: {
        from: 'titresDemarches.id',
        through: {
          from: 'titresDemarchesLiens.parentTitreDemarcheId',
          to: 'titresDemarchesLiens.enfantTitreDemarcheId'
        },
        to: 'titresDemarches.id'
      }
    }
  }

  public static modifiers: Modifiers = {
    orderDesc: builder => {
      builder.orderBy('ordre', 'desc')
    }
  }

  public $parseJson(json: Pojo) {
    json = super.$parseJson(json)

    if (!json.id && json.titreId && json.typeId) {
      json.id = `${json.titreId}-${json.typeId}99`
    }

    delete json.modification
    delete json.suppression
    delete json.etapesCreation

    return json
  }

  public $formatDatabaseJson(json: Pojo) {
    json = super.$formatDatabaseJson(json)

    delete json.modification
    delete json.suppression
    delete json.etapesCreation

    return json
  }
}

export default TitresDemarches
