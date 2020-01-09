import { Model, Modifiers, Pojo } from 'objection'
import DemarchesStatuts from './demarches-statuts'
import DemarchesTypes from './demarches-types'
import TitresEtapes from './titres-etapes'
import TitresPhases from './titres-phases'
import Types from './types'

export default class TitresDemarches extends Model {
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
      modelClass: DemarchesTypes,
      join: {
        from: 'titresDemarches.typeId',
        to: 'demarchesTypes.id'
      }
    },

    statut: {
      relation: Model.BelongsToOneRelation,
      modelClass: DemarchesStatuts,
      join: {
        from: 'titresDemarches.statutId',
        to: 'demarchesStatuts.id'
      }
    },

    titreType: {
      relation: Model.HasOneThroughRelation,
      modelClass: Types,
      join: {
        from: 'titresDemarches.titreId',
        through: {
          from: 'titres.id',
          to: 'titres.typeId'
        },
        to: 'types.id'
      }
    },

    etapes: {
      relation: Model.HasManyRelation,
      modelClass: TitresEtapes,
      join: {
        from: 'titresDemarches.id',
        to: 'titresEtapes.titreDemarcheId'
      }
    },

    phase: {
      relation: Model.HasOneRelation,
      modelClass: TitresPhases,
      join: {
        from: 'titresDemarches.id',
        to: 'titresPhases.titreDemarcheId'
      }
    },

    annulationDemarche: {
      relation: Model.BelongsToOneRelation,
      modelClass: TitresDemarches,
      join: {
        from: 'titresDemarches.annulationTitreDemarcheId',
        to: 'titresDemarches.id'
      }
    },

    parents: {
      relation: Model.ManyToManyRelation,
      modelClass: TitresDemarches,
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
      modelClass: TitresDemarches,
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

  public id!: string
  public titreId!: string
  public typeId!: string
  public statutId?: string
  public ordre?: number
  public annulationTitreDemarcheId?: string
  public type!: DemarchesTypes
  public statut?: DemarchesStatuts
  public titreType!: Types
  public etapes?: TitresEtapes[]
  public phase?: TitresPhases
  public annulationDemarche?: TitresDemarches
  public parents?: TitresDemarches[]
  public enfants?: TitresDemarches[]

  public $parseJson(json: Pojo) {
    json = super.$parseJson(json)

    if (!json.id && json.titreId && json.typeId) {
      json.id = `${json.titreId}-${json.typeId}99`
    }

    return json
  }
}
