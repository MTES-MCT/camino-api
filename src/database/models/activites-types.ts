import { Model } from 'objection'
import { join } from 'path'
import { IActivitesTypes } from '../../types'

interface ActivitesTypes extends IActivitesTypes {}

class ActivitesTypes extends Model {
  public static tableName = 'activitesTypes'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom', 'sections', 'frequenceId'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: 'string' },
      sections: { type: 'json' },
      frequenceId: { type: 'string', maxLength: 3 }
    }
  }

  public static relationMappings = {
    types: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'types'),
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
      modelClass: join(__dirname, 'pays'),
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
      modelClass: join(__dirname, 'frequences'),
      join: {
        from: 'activitesTypes.frequenceId',
        to: 'frequences.id'
      }
    },

    administrations: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'administrations'),
      join: {
        from: 'activitesTypes.id',
        through: {
          from: 'activitesTypes__administrations.activiteTypeId',
          to: 'activitesTypes__administrations.administrationId'
        },
        to: 'administrations.id'
      }
    }
  }
}

export default ActivitesTypes
