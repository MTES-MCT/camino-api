import { Model } from 'objection'
import { ITitreSDOMZone } from '../../types'

interface TitresSDOMZones extends ITitreSDOMZone {}

class TitresSDOMZones extends Model {
  public static tableName = 'titres__sdomZones'

  public static jsonSchema = {
    type: 'object',
    required: ['titreEtapeId', 'sdomZoneId'],

    properties: {
      sdomZoneId: { type: 'string', maxLength: 30 },
      titreEtapeId: { type: 'string', maxLength: 128 },
      surface: { type: 'number' }
    }
  }

  public static idColumn = ['sdomZoneId', 'titreEtapeId']
}

export default TitresSDOMZones
