import { Model } from 'objection'
import { join } from 'path'

import { IActiviteTypePays } from '../../types'

interface ActivitesTypesPays extends IActiviteTypePays {}

class ActivitesTypesPays extends Model {
  public static tableName = 'activitesTypes__pays'

  public static jsonSchema = {
    type: 'object',
    required: ['activiteTypeId', 'paysId'],

    properties: {
      activiteTypeId: { type: 'string', maxLength: 3 },
      paysId: { type: 'string', maxLength: 3 }
    }
  }

  public static idColumn = ['activiteTypeId', 'paysId']

  public static relationMappings = {
    activiteType: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'activites-types'),
      join: {
        from: 'activitesTypes__pays.activiteTypeId',
        to: 'activitesTypes.id'
      }
    },
    pays: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'pays'),
      join: {
        from: 'activitesTypes__pays.paysId',
        to: 'pays.id'
      }
    }
  }
}

export default ActivitesTypesPays
