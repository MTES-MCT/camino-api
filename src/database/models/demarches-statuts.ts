import { Model } from 'objection'
import { IDemarchesStatuts } from '../../types'

interface DemarchesStatuts extends IDemarchesStatuts {}

class DemarchesStatuts extends Model {
  public static tableName = 'demarchesStatuts'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom', 'couleur'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: 'string' },
      couleur: { type: 'string', maxLength: 8 }
    }
  }
}

export default DemarchesStatuts
