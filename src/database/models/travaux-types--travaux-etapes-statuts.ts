import { Model } from 'objection'
import { join } from 'path'
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

  public static relationMappings = {
    travauxEtapeType: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'travaux-etapes-types'),
      join: {
        from: 'travauxEtapesTypes__etapesStatuts.travauxEtapeTypeId',
        to: 'travauxEtapesTypes.id'
      }
    },
    etapeStatut: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'etapes-statuts'),
      join: {
        from: 'travauxEtapesTypes__etapesStatuts.etapeStatutId',
        to: 'etapesStatuts.id'
      }
    }
  }
}

export default TravauxEtapesTypesEtapesStatuts
