import { Model } from 'objection'
import DemarchesStatuts from './demarches-statuts'
import EtapesTypes from './etapes-types'

export default class DemarchesTypes extends Model {
  static tableName = 'demarchesTypes'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: 'string' },
      ordre: { type: 'integer' },
      duree: { type: 'boolean' },
      points: { type: 'boolean' },
      substances: { type: 'boolean' },
      titulaires: { type: 'boolean' },
      renouvelable: { type: 'boolean' },
      exception: { type: 'boolean' }
    }
  }

  static relationMappings = {
    demarchesStatuts: {
      relation: Model.ManyToManyRelation,
      modelClass: DemarchesStatuts,
      join: {
        from: 'demarchesTypes.id',
        through: {
          from: 'demarchesTypes__demarchesStatuts.demarcheTypeId',
          to: 'demarchesTypes__demarchesStatuts.demarcheStatutId',
          extra: ['ordre']
        },
        to: 'demarchesStatuts.id'
      }
    },

    etapesTypes: {
      relation: Model.ManyToManyRelation,
      modelClass: EtapesTypes,
      join: {
        from: 'demarchesTypes.id',
        through: {
          from: 'demarchesTypes__etapesTypes.demarcheTypeId',
          to: 'demarchesTypes__etapesTypes.etapeTypeId',
          extra: ['ordre', 'typeId']
        },
        to: 'etapesTypes.id'
      }
    }
  }
}
