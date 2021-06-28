import { Model } from 'objection'
import { join } from 'path'
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

  public static relationMappings = {
    etapeType: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'etapes-types'),
      join: {
        from: 'etapesTypes__etapesStatuts.etapeTypeId',
        to: 'etapesTypes.id'
      }
    },
    etapeStatut: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'etapes-statuts'),
      join: {
        from: 'etapesTypes__etapesStatuts.etapeStatutId',
        to: 'etapesStatuts.id'
      }
    }
  }
}

export default EtapesTypesEtapesStatuts
