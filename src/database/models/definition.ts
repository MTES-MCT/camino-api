import { IDefinition } from '../../types'
import { Model, Modifiers } from 'objection'

interface Definitions extends IDefinition {}

class Definitions extends Model {
  public static tableName = 'definitions'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: 'string' },
      table: { type: ['string', 'null'] },
      description: { type: ['string', 'null'], maxLength: 2048 }
    }
  }
}

export default Definitions
