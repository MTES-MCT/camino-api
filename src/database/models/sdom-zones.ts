import { Model } from 'objection'
import { ISDOMZone } from '../../types'

interface SDOMZones extends ISDOMZone {}

class SDOMZones extends Model {
  public static tableName = 'sdomZones'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 30 },
      nom: { type: 'string' }
    }
  }
}

export default SDOMZones
