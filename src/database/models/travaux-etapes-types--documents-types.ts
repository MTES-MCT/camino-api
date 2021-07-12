import { Model } from 'objection'
import { join } from 'path'
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

  public static relationMappings = {
    travauxEtapeType: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'travaux-etapes-types'),
      join: {
        from: 'travauxEtapesTypes__documentsTypes.travauxEtapeTypeId',
        to: 'travauxEtapesTypes.id'
      }
    },
    documentType: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'documents-types'),
      join: {
        from: 'travauxEtapesTypes__documentsTypes.documentTypeId',
        to: 'documentsTypes.id'
      }
    }
  }
}

export default TravauxEtapesTypesDocumentsTypes
