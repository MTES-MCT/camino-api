import { Model } from 'objection'

import { IDocumentsTypes } from '../../types'

interface DocumentsTypes extends IDocumentsTypes {}

class DocumentsTypes extends Model {
  public static tableName = 'documentsTypes'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: 'string', maxLength: 128 }
    }
  }
}

export default DocumentsTypes
