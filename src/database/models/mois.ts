import { Model } from 'objection'
import { join } from 'path'
import Frequences from './frequences'
import Trimestres from './trimestres'

export default class Mois extends Model {
  public static tableName = 'mois'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom', 'trimestreId'],

    properties: {
      id: { type: 'integer', maxLength: 2 },
      nom: { type: 'string' },
      frequenceId: { type: 'string', maxLength: 3 },
      trimestreId: { type: 'integer', maxLength: 1 }
    }
  }

  public static relationMappings = {
    trimestre: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'trimestre'),
      join: {
        from: 'mois.trimestreId',
        to: 'trimestre.id'
      }
    },

    frequence: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'trimestre'),
      join: {
        from: 'mois.trimestreId',
        to: 'trimestre.id'
      }
    }
  }

  public id!: string
  public nom!: string
  public trimestreId!: string
  public frequenceId!: string
  public trimestre!: Trimestres
  public frequence!: Frequences
}
