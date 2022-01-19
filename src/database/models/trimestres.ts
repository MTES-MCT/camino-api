import { Model } from 'objection'

import { ITrimestre } from '../../types'
import Mois from './mois'
import Frequences from './frequences'

interface Trimestres extends ITrimestre {}

class Trimestres extends Model {
  public static tableName = 'trimestres'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'integer' },
      nom: { type: 'string' },
      frequenceId: { type: 'string', maxLength: 3 }
    }
  }

  static relationMappings = () => ({
    mois: {
      relation: Model.HasManyRelation,
      modelClass: Mois,
      join: {
        from: 'trimestres.id',
        to: 'mois.trimestreId'
      }
    },

    frequence: {
      relation: Model.BelongsToOneRelation,
      modelClass: Frequences,
      join: {
        from: 'trimestre.frequenceId',
        to: 'frequences.id'
      }
    }
  })
}

export default Trimestres
