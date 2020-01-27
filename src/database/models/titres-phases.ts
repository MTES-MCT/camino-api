import { Model } from 'objection'
import { join } from 'path'
import { ITitresPhases } from '../../types'

interface TitresPhases extends ITitresPhases {}

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

  public static relationMappings = {
    statut: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'phases-statuts'),
      join: {
        from: 'titresPhases.statutId',
        to: 'phasesStatuts.id'
      }
    }
  }

  public static idColumn = 'titreDemarcheId'
}

export default TitresPhases
