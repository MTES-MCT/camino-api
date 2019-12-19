import { Model } from 'objection'
import EtapesTypes from './etapes-types'

export default class DemarchesTypes extends Model {
  static tableName = 'demarchesTypes'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: 'string' },
      ordre: { type: ['integer', 'null'] },
      duree: { type: ['boolean', 'null'] },
      points: { type: ['boolean', 'null'] },
      substances: { type: ['boolean', 'null'] },
      titulaires: { type: ['boolean', 'null'] },
      renouvelable: { type: ['boolean', 'null'] },
      exception: { type: ['boolean', 'null'] }
    }
  }

  static relationMappings = {
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

  static modifiers = {
    orderAsc: builder => {
      builder.orderBy('ordre', 'asc')
    }
  }
}
