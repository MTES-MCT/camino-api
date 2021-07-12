import { Model } from 'objection'
import { join } from 'path'
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

  public static relationMappings = {
    activiteType: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'activites-types'),
      join: {
        from: 'activitesTypes__titresTypes.activiteTypeId',
        to: 'activitesTypes.id'
      }
    },
    titreType: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'titres-types'),
      join: {
        from: 'activitesTypes__titresTypes.titreTypeId',
        to: 'titresTypes.id'
      }
    }
  }
}

export default ActivitesTypesTitresTypes
