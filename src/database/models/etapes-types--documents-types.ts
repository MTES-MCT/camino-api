import { Model } from 'objection'
import { IEtapeTypeDocumentType } from '../../types'

interface EtapesTypesDocumentsTypes extends IEtapeTypeDocumentType {}

class EtapesTypesDocumentsTypes extends Model {
  public static tableName = 'etapesTypes__documentsTypes'

  public static jsonSchema = {
    type: 'object',
    required: ['etapeTypeId', 'documentTypeId'],

    properties: {
      etapeTypeId: { type: 'string', maxLength: 3 },
      documentTypeId: { type: 'string', maxLength: 3 },
      optionnel: { type: 'boolean' },
      description: { type: ['string', 'null'] }
    }
  }

  public static idColumn = ['etapeTypeId', 'documentTypeId']
}

export default EtapesTypesDocumentsTypes
