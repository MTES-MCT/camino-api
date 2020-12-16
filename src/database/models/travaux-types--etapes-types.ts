import { Model } from 'objection'
import { ITravauxTypeEtapeType } from '../../types'

interface TravauxTypesEtapesTypes extends ITravauxTypeEtapeType {}

class TravauxTypesEtapesTypes extends Model {
  public static tableName = 'travauxTypes__etapesTypes'

  public static jsonSchema = {
    type: 'object',
    required: ['travauxTypeId', 'etapeTypeId'],

    properties: {
      travauxTypeId: { type: 'string', maxLength: 3 },
      etapeTypeId: { type: 'string', maxLength: 3 },
      ordre: { type: 'integer' }
    }
  }

  public static idColumn = ['travauxTypeId', 'etapeTypeId']
}

export default TravauxTypesEtapesTypes
