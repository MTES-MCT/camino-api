import { Model } from 'objection'
import DemarchesTypes from './demarches-types'
import Types from './types'
import DemarchesStatuts from './demarches-statuts'
import TitresPhases from './titres-phases'
import TitresEtapes from './titres-etapes'

export default class TitresDemarches extends Model {
  static tableName = 'titresDemarches'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'titreId', 'typeId'],

    properties: {
      id: { type: 'string', maxLength: 128 },
      titreId: { type: 'string', maxLength: 128 },
      typeId: { type: 'string', maxLength: 8 },
      statutId: { type: 'string', maxLength: 3 },
      ordre: { type: 'integer' },
      annulationTitreDemarcheId: { type: ['string', 'null'], maxLength: 128 }
    }
  }

  static relationMappings = {
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

  $parseJson(json) {
    json = super.$parseJson(json)

    if (!json.id && json.titreId && json.typeId) {
      json.id = `${json.titreId}-${json.typeId}99`
    }

    return json
  }

  static namedFilters = {
    orderDesc: builder => {
      builder.orderBy('ordre', 'desc')
    }
  }
}
