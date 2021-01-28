import { Model } from 'objection'
import { ITitreTypeActiviteType } from '../../types'

interface TitresTypesActivitesTypes extends ITitreTypeActiviteType {}

class TitresTypesActivitesTypes extends Model {
  public static tableName = 'titresTypes__activitesTypes'

  public static jsonSchema = {
    type: 'object',
    required: ['titreTypeId', 'activiteTypeId'],

    properties: {
      titreTypeId: { type: 'string', maxLength: 3 },
      activiteTypeId: { type: 'string', maxLength: 3 }
    }
  }

  public static idColumn = ['titreTypeId', 'activiteTypeId']
}

export default TitresTypesActivitesTypes
