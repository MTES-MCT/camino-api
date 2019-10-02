import { Model } from 'objection'

export default class Permissions extends Model {
  static tableName = 'permissions'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 12 },
      nom: { type: 'string' },
      ordre: { type: 'integer' }
    }
  }

  static modifiers = {
    orderAsc: builder => {
      builder.orderBy('ordre', 'asc')
    }
  }
}
