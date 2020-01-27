import { Model, Modifiers } from 'objection'

import { IPermissions } from '../../types'

interface Permissions extends IPermissions {}

class Permissions extends Model {
  public static tableName = 'permissions'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 12 },
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

export default Permissions
