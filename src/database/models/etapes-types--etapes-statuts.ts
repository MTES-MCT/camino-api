import { Model } from 'objection'
import { IEtapeTypeEtapeStatut } from '../../types'

interface EtapesTypesEtapesStatuts extends IEtapeTypeEtapeStatut {}

class EtapesTypesEtapesStatuts extends Model {
  public static tableName = 'etapesTypes__etapesStatuts'

  public static jsonSchema = {
    type: 'object',
    required: ['etapeTypeId', 'etapeStatutId'],

    properties: {
      etapeTypeId: { type: 'string', maxLength: 3 },
      etapeStatutId: { type: 'string', maxLength: 3 },
      ordre: { type: 'integer' }
    }
  }

  public static idColumn = ['etapeTypeId', 'etapeStatutId']
}

export default EtapesTypesEtapesStatuts
