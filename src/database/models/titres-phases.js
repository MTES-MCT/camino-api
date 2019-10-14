import { Model } from 'objection'
import PhasesStatuts from './phases-statuts'

export default class TitresPhases extends Model {
  static tableName = 'titresPhases'

  static jsonSchema = {
    type: 'object',
    required: ['titreDemarcheId', 'statutId'],

    properties: {
      titreDemarcheId: { type: 'string', maxLength: 128 },
      statutId: { type: 'string', maxLength: 3 },
      dateDebut: { type: 'string' },
      dateFin: { type: 'string' }
    }
  }

  static relationMappings = {
    statut: {
      relation: Model.BelongsToOneRelation,
      modelClass: PhasesStatuts,
      join: {
        from: 'titresPhases.statutId',
        to: 'phasesStatuts.id'
      }
    }
  }

  static idColumn = 'titreDemarcheId'
}
