import { Model } from 'objection'
import { IDemarcheTypeDemarcheStatut } from '../../types'

interface DemarchesTypesDemarchesStatuts extends IDemarcheTypeDemarcheStatut {}

class DemarchesTypesDemarchesStatuts extends Model {
  public static tableName = 'demarchesTypes__demarchesStatuts'

  public static jsonSchema = {
    type: 'object',
    required: ['demarcheTypeId', 'demarcheStatutId'],

    properties: {
      demarcheTypeId: { type: 'string', maxLength: 3 },
      demarcheStatutId: { type: 'string', maxLength: 3 },
      ordre: { type: 'integer' }
    }
  }

  public static idColumn = ['demarcheTypeId', 'demarcheStatutId']
}

export default DemarchesTypesDemarchesStatuts
