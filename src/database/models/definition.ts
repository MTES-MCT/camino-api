import { IDefinition } from '../../types'
import { Model } from 'objection'

interface Definitions extends IDefinition {}

class Definitions extends Model {
  public static tableName = 'definitions'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom', 'ordre', 'slug'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: 'string' },
      slug: { type: 'string' },
      description: { type: ['string', 'null'], maxLength: 2048 },
      ordre: { type: 'integer' }
    }
  }
}

export default Definitions
