import { Model } from 'objection'
import { ITitreEtapeJustificatif } from '../../types'
import { join } from 'path'

interface TitresEtapesJustificatifs extends ITitreEtapeJustificatif {}

class TitresEtapesJustificatifs extends Model {
  public static tableName = 'titresEtapesJustificatifs'

  public static jsonSchema = {
    type: 'object',
    required: ['titreEtapeId', 'documentId'],

    properties: {
      documentId: { type: 'string', maxLength: 128 },
      titreEtapeId: { type: 'string', maxLength: 128 }
    }
  }

  public static idColumn = ['documentId', 'titreEtapeId']

  public static relationMappings = {
    etape: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'titres-etapes'),
      join: {
        from: 'titresEtapesJustificatifs.titreEtapeId',
        to: 'titresEtapes.id'
      }
    },
    document: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'documents'),
      join: {
        from: 'titresEtapesJustificatifs.documentId',
        to: 'documents.id'
      }
    }
  }
}

export default TitresEtapesJustificatifs
