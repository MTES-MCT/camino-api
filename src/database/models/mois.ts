import { Model } from 'objection'

import { IMois } from '../../types'
import Trimestres from './trimestres'

interface Mois extends IMois {}

class Mois extends Model {
  public static tableName = 'mois'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom', 'trimestreId'],

    properties: {
      id: { type: 'integer' },
      nom: { type: 'string' },
      frequenceId: { type: 'string', maxLength: 3 },
      trimestreId: { type: 'integer' }
    }
  }

  static relationMappings = () => ({
    trimestre: {
      relation: Model.BelongsToOneRelation,
      modelClass: Trimestres,
      join: {
        from: 'mois.trimestreId',
        to: 'trimestre.id'
      }
    },

    frequence: {
      relation: Model.BelongsToOneRelation,
      modelClass: Trimestres,
      join: {
        from: 'mois.trimestreId',
        to: 'trimestre.id'
      }
    }
  })
}

export default Mois
