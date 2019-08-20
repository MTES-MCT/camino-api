import { Model } from 'objection'
import Types from './types'
import Frequences from './frequences'
import Pays from './pays'

export default class TaxesTypes extends Model {
  static tableName = 'taxesTypes'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: 'string' },
      sections: { type: 'json' },
      paysId: { type: 'string', maxLength: 3 },
      frequenceId: { type: 'string', maxLength: 3 }
    }
  }

  static relationMappings = {
    types: {
      relation: Model.ManyToManyRelation,
      modelClass: Types,
      join: {
        from: 'taxesTypes.id',
        through: {
          from: 'taxesTypes__types.taxeTypeId',
          to: 'taxesTypes__types.typeId',
          extra: ['domaineId']
        },
        to: 'types.id'
      }
    },

    pays: {
      relation: Model.ManyToManyRelation,
      modelClass: Pays,
      join: {
        from: 'taxesTypes.id',
        through: {
          from: 'taxesTypes__pays.taxeTypeId',
          to: 'taxesTypes__pays.paysId'
        },
        to: 'pays.id'
      }
    },

    frequence: {
      relation: Model.BelongsToOneRelation,
      modelClass: Frequences,
      join: {
        from: 'taxesTypes.frequenceId',
        to: 'frequences.id'
      }
    }
  }
}
