import { Model } from 'objection'
import { ITitreAdministration } from '../../types'

interface TitresAdministrations extends ITitreAdministration {}

class TitresAdministrations extends Model {
  public static tableName = 'titresAdministrations'

  public static jsonSchema = {
    type: 'object',
    required: ['titreId', 'administrationId'],

    properties: {
      administrationId: { type: 'string', maxLength: 64 },
      titreId: { type: 'string', maxLength: 128 }
    }
  }

  public static idColumn = ['administrationId', 'titreId']
}

export default TitresAdministrations
