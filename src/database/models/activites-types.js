import { Model } from 'objection'
import Types from './types'
import Frequences from './frequences'
import Pays from './pays'

export default class ActivitesTypes extends Model {
  static tableName = 'activitesTypes'

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
        from: 'activitesTypes.id',
        through: {
          from: 'activitesTypes__types.activiteTypeId',
          to: 'activitesTypes__types.typeId',
          extra: ['domaineId']
        },
        to: 'types.id'
      }
    },

    pays: {
      relation: Model.ManyToManyRelation,
      modelClass: Pays,
      join: {
        from: 'activitesTypes.id',
        through: {
          from: 'activitesTypes__pays.activiteTypeId',
          to: 'activitesTypes__pays.paysId'
        },
        to: 'pays.id'
      }
    },

    frequence: {
      relation: Model.BelongsToOneRelation,
      modelClass: Frequences,
      join: {
        from: 'activitesTypes.frequenceId',
        to: 'frequences.id'
      }
    }
  }
}
