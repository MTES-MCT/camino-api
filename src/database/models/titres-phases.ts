import { Model } from 'objection'
import PhasesStatuts from './phases-statuts'

export default class TitresPhases extends Model {
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
      modelClass: PhasesStatuts,
      join: {
        from: 'titresPhases.statutId',
        to: 'phasesStatuts.id'
      }
    }
  }

  public static idColumn = 'titreDemarcheId'

  public titreDemarcheId!: string
  public statutId!: string
  public dateDebut!: string
  public dateFin!: string
  public statut!: PhasesStatuts
}
