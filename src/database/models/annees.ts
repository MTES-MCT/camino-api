import { Model } from 'objection'
import { join } from 'path'
import Frequences from './frequences'

export default class Annees extends Model {
  public static tableName = 'annees'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'integer', maxLength: 1 },
      nom: { type: 'string' },
      frequenceId: { type: 'string', maxLength: 3 }
    }
  }

  public static relationMappings = {
    frequence: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'frequence'),
      join: {
        from: 'annee.frequenceId',
        to: 'frequences.id'
      }
    }
  }

  public id!: string
  public nom!: string
  public frequenceId!: string
  public frequence!: Frequences
}
