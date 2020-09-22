import { Model } from 'objection'
import { IForet } from '../../types'

interface Forets extends IForet {}

class Forets extends Model {
  public static tableName = 'forets'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 30 },
      nom: { type: 'string' }
    }
  }
}

export default Forets
