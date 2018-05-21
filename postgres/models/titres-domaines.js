const { Model } = require('objection')
const Types = require('./titres-types')

class Domaine extends Model {
  static get tableName() {
    return 'titres_domaines'
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
          from: 'titres_domaines.id',
          through: {
            from: 'titres_domaines_types.domaine_id',
            to: 'titres_domaines_types.type_id'
          },
          to: 'titres_types.id'
        }
      }
    }
  }
}

module.exports = Domaine
