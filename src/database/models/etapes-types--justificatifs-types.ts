import { Model } from 'objection'
import { IEtapeTypeJustificatifType } from '../../types'

interface EtapesTypesJustificatifsTypes extends IEtapeTypeJustificatifType {}

class EtapesTypesJustificatifsTypes extends Model {
  public static tableName = 'etapesTypes__justificatifsTypes'

  public static jsonSchema = {
    type: 'object',
    required: ['etapeTypeId', 'documentTypeId'],

    properties: {
      etapeTypeId: { type: 'string', maxLength: 3 },
      documentTypeId: { type: 'string', maxLength: 3 },
      optionnel: { type: 'boolean' }
    }
  }

  public static idColumn = ['etapeTypeId', 'documentTypeId']
}

export default EtapesTypesJustificatifsTypes
