import { Model } from 'objection'
import DemarchesTypes from './demarches-types'
import DemarchesStatuts from './demarches-statuts'
import TitresPhases from './titres-phases'
import TitresEtapes from './titres-etapes'

export default class TitresDemarches extends Model {
  static tableName = 'titresDemarches'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'titreId'],

    properties: {
      id: { type: 'string', maxLength: 128 },
      titreId: { type: 'string', maxLength: 128 },
      typeId: { type: 'string', maxLength: 8 },
      statutId: { type: 'string', maxLength: 3 },
      ordre: { type: 'integer' },
      annulationTitreDemarcheId: { type: 'string', maxLength: 128 }
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

    phase: {
      relation: Model.BelongsToOneRelation,
      modelClass: TitresPhases,
      join: {
        from: 'titresDemarches.id',
        to: 'titresPhases.titreDemarcheId'
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

  // $parseDatabaseJson(json) {
  //   json = super.$parseDatabaseJson(json)
  //   if (json) {
  //     console.log('--------------->', json)
  //   }
  //   console.log('<---------------')
  //   return json
  // }

  static namedFilters = {
    orderDesc: builder => {
      builder.orderBy('ordre', 'desc')
    }
  }
}
