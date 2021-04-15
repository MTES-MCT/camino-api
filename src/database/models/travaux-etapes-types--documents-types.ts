import { Model } from 'objection'
import { ITravauxEtapeTypeDocumentType } from '../../types'

interface TravauxEtapesTypesDocumentsTypes
  extends ITravauxEtapeTypeDocumentType {}

class TravauxEtapesTypesDocumentsTypes extends Model {
  public static tableName = 'travauxEtapesTypes__documentsTypes'

  public static jsonSchema = {
    type: 'object',
    required: ['travauxEtapeTypeId', 'documentTypeId'],

    properties: {
      travauxEtapeTypeId: { type: 'string', maxLength: 3 },
      documentTypeId: { type: 'string', maxLength: 3 },
      optionnel: { type: 'boolean' }
    }
  }

  public static idColumn = ['travauxEtapeTypeId', 'documentTypeId']
}

export default TravauxEtapesTypesDocumentsTypes
