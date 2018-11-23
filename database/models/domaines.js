const { Model } = require('objection')
const Types = require('./types')

class Domaines extends Model {
  static get tableName() {
    return 'domaines'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'nom'],

      properties: {
        id: { type: 'string', maxLength: 1 },
        nom: { type: 'string' }
      }
    }
  }

  static get relationMappings() {
    return {
      types: {
        relation: Model.ManyToManyRelation,
        modelClass: Types,
        join: {
          from: 'domaines.id',
          through: {
            from: 'domaines__types.domaineId',
            to: 'domaines__types.typeId',
            extra: ['archive']
          },
          to: 'types.id'
        }
      }
    }
  }
}

module.exports = Domaines
