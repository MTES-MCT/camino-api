import { Model } from 'objection'
import { join } from 'path'
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

  public static relationMappings = {
    etapeType: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'etapes-types'),
      join: {
        from: 'etapesTypes__justificatifsTypes.etapeTypeId',
        to: 'etapesTypes.id'
      }
    },
    documentType: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'documents-types'),
      join: {
        from: 'etapesTypes__justificatifsTypes.documentTypeId',
        to: 'documentsTypes.id'
      }
    }
  }
}

export default EtapesTypesJustificatifsTypes
