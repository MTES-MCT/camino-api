import { Model } from 'objection'
import { ITravauxTypeDemarcheStatut } from '../../types'

interface TravauxTypesDemarchesStatuts extends ITravauxTypeDemarcheStatut {}

class TravauxTypesDemarchesStatuts extends Model {
  public static tableName = 'travauxTypes__demarchesStatuts'

  public static jsonSchema = {
    type: 'object',
    required: ['travauxTypeId', 'demarcheStatutId'],

    properties: {
      travauxTypeId: { type: 'string', maxLength: 3 },
      demarcheStatutId: { type: 'string', maxLength: 3 },
      ordre: { type: 'integer' }
    }
  }

  public static idColumn = ['travauxTypeId', 'demarcheStatutId']
}

export default TravauxTypesDemarchesStatuts
