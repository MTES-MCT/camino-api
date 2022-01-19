import { Model } from 'objection'

import { IAnnee } from '../../types'
import Frequences from './frequences'

interface Annees extends IAnnee {}

class Annees extends Model {
  public static tableName = 'annees'

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
    frequence: {
      relation: Model.BelongsToOneRelation,
      modelClass: Frequences,
      join: {
        from: 'annee.frequenceId',
        to: 'frequences.id'
      }
    }
  })
}

export default Annees
