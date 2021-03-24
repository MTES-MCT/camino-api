import { Model } from 'objection'

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
}

export default ActivitesTypesDocumentsTypes
