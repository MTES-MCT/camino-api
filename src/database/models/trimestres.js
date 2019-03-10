import { Model } from 'objection'
import Mois from './mois'

export default class Trimestres extends Model {
  static tableName = 'trimestres'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'integer', maxLength: 1 },
      nom: { type: 'string' },
      freqeunceId: { type: 'string', maxLength: 3 }
    }
  }

  static relationMappings = {
    mois: {
      relation: Model.HasManyRelation,
      modelClass: Mois,
      join: {
        from: 'trimestres.id',
        to: 'mois.trimestreId'
      }
    }
  }
}
