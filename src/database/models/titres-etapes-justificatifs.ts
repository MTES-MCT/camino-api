import { Model } from 'objection'
import { ITitreEtapeJustificatif } from '../../types'

interface TitresEtapesJustificatifs extends ITitreEtapeJustificatif {}

class TitresEtapesJustificatifs extends Model {
  public static tableName = 'TitresEtapesJustificatifs'

  public static jsonSchema = {
    type: 'object',
    required: ['titreEtapeId', 'documentId'],

    properties: {
      documentId: { type: 'string', maxLength: 128 },
      titreEtapeId: { type: 'string', maxLength: 128 }
    }
  }

  public static idColumn = ['documentId', 'titreEtapeId']
}

export default TitresEtapesJustificatifs
