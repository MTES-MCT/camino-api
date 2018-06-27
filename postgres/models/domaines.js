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
      type: {
        relation: Model.ManyToManyRelation,
        modelClass: Types,
        join: {
          from: 'domaines.id',
          through: {
            from: '_domaines_types.domaine_id',
            to: '_domaines_types.type_id'
          },
          to: 'types.id'
        }
      }
    }
  }
}

module.exports = Domaines
