import { Model } from 'objection'
import { join } from 'path'

import { IActiviteTypeDocumentType } from '../../types'

interface ActivitesTypesDocumentsTypes extends IActiviteTypeDocumentType {}

class ActivitesTypesDocumentsTypes extends Model {
  public static tableName = 'activitesTypes__documentsTypes'

  public static jsonSchema = {
    type: 'object',
    required: ['activiteTypeId', 'documentTypeId'],

    properties: {
      activiteTypeId: { type: 'string', maxLength: 3 },
      documentTypeId: { type: 'string', maxLength: 3 },
      optionnel: { type: ['boolean', 'null'] }
    }
  }

  public static idColumn = ['activiteTypeId', 'documentTypeId']

  public static relationMappings = {
    activiteType: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'activites-types'),
      join: {
        from: 'activitesTypes__documentsTypes.activiteTypeId',
        to: 'activitesTypes.id'
      }
    },
    documentType: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'documents-types'),
      join: {
        from: 'activitesTypes__documentsTypes.documentTypeId',
        to: 'documentsTypes.id'
      }
    }
  }
}

export default ActivitesTypesDocumentsTypes
