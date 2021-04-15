import { Model } from 'objection'
import { ITravauxTypeTravauxEtapeType } from '../../types'

interface TravauxTypesTravauxEtapesTypes extends ITravauxTypeTravauxEtapeType {}

class TravauxTypesTravauxEtapesTypes extends Model {
  public static tableName = 'travauxTypes__travauxEtapesTypes'

  public static jsonSchema = {
    type: 'object',
    required: ['travauxTypeId', 'travauxEtapeTypeId'],

    properties: {
      travauxTypeId: { type: 'string', maxLength: 3 },
      travauxEtapeTypeId: { type: 'string', maxLength: 3 },
      ordre: { type: 'integer' }
    }
  }

  public static idColumn = ['travauxTypeId', 'travauxEtapeTypeId']
}

export default TravauxTypesTravauxEtapesTypes
