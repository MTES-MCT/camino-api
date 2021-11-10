import { Model } from 'objection'
import { join } from 'path'

import { IMois } from '../../types'

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
}

export default Mois
