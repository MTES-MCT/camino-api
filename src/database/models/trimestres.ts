import { Model } from 'objection'
import { join } from 'path'
import Frequences from './frequences'
import Mois from './mois'

export default class Trimestres extends Model {
  public static tableName = 'trimestres'

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
    mois: {
      relation: Model.HasManyRelation,
      modelClass: join(__dirname, 'mois'),
      join: {
        from: 'trimestres.id',
        to: 'mois.trimestreId'
      }
    },

    frequence: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'frequence'),
      join: {
        from: 'trimestre.frequenceId',
        to: 'frequences.id'
      }
    }
  }

  public id!: string
  public nom!: string
  public frequenceId!: string
  public frequence!: Frequences
  public mois!: Mois[]
}
