import { Model } from 'objection'
import { ITitreEtapeJustificatif } from '../../types'
import TitresEtapes from './titres-etapes'
import Document from './documents'

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

  static relationMappings = () => ({
    etape: {
      relation: Model.BelongsToOneRelation,
      modelClass: TitresEtapes,
      join: {
        from: 'titresEtapesJustificatifs.titreEtapeId',
        to: 'titresEtapes.id'
      }
    },
    document: {
      relation: Model.BelongsToOneRelation,
      modelClass: Document,
      join: {
        from: 'titresEtapesJustificatifs.documentId',
        to: 'documents.id'
      }
    }
  })
}

export default TitresEtapesJustificatifs
