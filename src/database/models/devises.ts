import { Model, Modifiers } from 'objection'

import { IDevises } from '../../types'

interface Devises extends IDevises {}

class Devises extends Model {
  public static tableName = 'devises'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: 'string' },
      ordre: { type: 'integer' }
    }
  }

  public static modifiers: Modifiers = {
    orderAsc: builder => {
      builder.orderBy('ordre', 'asc')
    }
  }
}

export default Devises
