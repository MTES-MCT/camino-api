import { Model } from 'objection'
import { ITravauxEtapeTypeEtapeStatut } from '../../types'

interface TravauxEtapesTypesEtapesStatuts
  extends ITravauxEtapeTypeEtapeStatut {}

class TravauxEtapesTypesEtapesStatuts extends Model {
  public static tableName = 'travauxEtapesTypes__etapesStatuts'

  public static jsonSchema = {
    type: 'object',
    required: ['travauxEtapeTypeId', 'etapeStatutId'],

    properties: {
      etapeTypeId: { type: 'string', maxLength: 3 },
      etapeStatutId: { type: 'string', maxLength: 3 },
      ordre: { type: 'integer' }
    }
  }

  public static idColumn = ['travauxEtapeTypeId', 'etapeStatutId']
}

export default TravauxEtapesTypesEtapesStatuts
