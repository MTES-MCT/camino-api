import { Model } from 'objection'
import { IActiviteTypeTitreType } from '../../types'

interface ActivitesTypesTitresTypes extends IActiviteTypeTitreType {}

class ActivitesTypesTitresTypes extends Model {
  public static tableName = 'activitesTypes__titresTypes'

  public static jsonSchema = {
    type: 'object',
    required: ['activiteTypeId', 'titreTypeId'],

    properties: {
      activiteTypeId: { type: 'string', maxLength: 3 },
      titreTypeId: { type: 'string', maxLength: 3 }
    }
  }

  public static idColumn = ['activiteTypeId', 'titreTypeId']
}

export default ActivitesTypesTitresTypes
