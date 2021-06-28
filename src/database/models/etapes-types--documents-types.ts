import { Model } from 'objection'
import { join } from 'path'
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
      optionnel: { type: 'boolean' }
    }
  }

  public static idColumn = ['etapeTypeId', 'documentTypeId']

  public static relationMappings = {
    etapeType: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'etapes-types'),
      join: {
        from: 'etapesTypes__documentsTypes.etapeTypeId',
        to: 'etapesTypes.id'
      }
    },
    documentType: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'documents-types'),
      join: {
        from: 'etapesTypes__documentsTypes.documentTypeId',
        to: 'documentsTypes.id'
      }
    }
  }
}

export default EtapesTypesDocumentsTypes
