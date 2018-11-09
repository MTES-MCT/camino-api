const { Model } = require('objection')

class Permissions extends Model {
  static get tableName() {
    return 'permissions'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'nom'],

      properties: {
        id: { type: 'string', maxLength: 12 },
        nom: { type: 'string' },
        ordre: { type: 'integer' }
      }
    }
  }

  static get namedFilters() {
    return {
      orderAsc: builder => {
        builder.orderBy('ordre', 'asc')
      }
    }
  }
}

module.exports = Permissions
