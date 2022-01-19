import { Model } from 'objection'
import { ITitrePhase } from '../../types'
import PhasesStatuts from './phases-statuts'

interface TitresPhases extends ITitrePhase {}

class TitresPhases extends Model {
  public static tableName = 'titresPhases'

  public static jsonSchema = {
    type: 'object',
    required: ['titreDemarcheId', 'statutId'],

    properties: {
      titreDemarcheId: { type: 'string', maxLength: 128 },
      statutId: { type: 'string', maxLength: 3 },
      dateDebut: { type: 'string' },
      dateFin: { type: 'string' }
    }
  }

  static relationMappings = () => ({
    statut: {
      relation: Model.BelongsToOneRelation,
      modelClass: PhasesStatuts,
      join: {
        from: 'titresPhases.statutId',
        to: 'phasesStatuts.id'
      }
    }
  })

  public static idColumn = 'titreDemarcheId'
}

export default TitresPhases
