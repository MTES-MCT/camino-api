import { Model } from 'objection'
import { ITitreForet } from '../../types'

interface TitresForets extends ITitreForet {}

class TitresForets extends Model {
  public static tableName = 'titresForets'

  public static jsonSchema = {
    type: 'object',
    required: ['titreEtapeId', 'foretId'],

    properties: {
      foretId: { type: 'string', maxLength: 8 },
      titreEtapeId: { type: 'string', maxLength: 128 },
      surface: { type: 'number' }
    }
  }

  public static idColumn = ['foretId', 'titreEtapeId']
}

export default TitresForets
