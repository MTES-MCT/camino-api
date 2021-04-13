import { Model } from 'objection'
import { ITravauxEtapeTypeEtapeStatut } from '../../types'

interface TravauxEtapesTypesEtapesStatuts
  extends ITravauxEtapeTypeEtapeStatut {}

class TravauxEtapesTypesEtapesStatuts extends Model {
  public static tableName = 'TravauxEtapesTypes__etapesStatuts'

  public static jsonSchema = {
    type: 'object',
    required: ['TravauxEtapeTypeId', 'etapeStatutId'],

    properties: {
      etapeTypeId: { type: 'string', maxLength: 3 },
      etapeStatutId: { type: 'string', maxLength: 3 },
      ordre: { type: 'integer' }
    }
  }

  public static idColumn = ['TravauxEtapeTypeId', 'etapeStatutId']
}

export default TravauxEtapesTypesEtapesStatuts
