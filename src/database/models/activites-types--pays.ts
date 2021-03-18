import { Model } from 'objection'

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
}

export default ActivitesTypesPays
