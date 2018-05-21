const { Model } = require('objection')
const Types = require('./titres-types')

class Domaines extends Model {
  static get tableName() {
    return 'titresDomaines'
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
          from: 'titresDomaines.id',
          through: {
            from: 'titresDomainesTypes.domaineId',
            to: 'titresDomainesTypes.typeId'
          },
          to: 'titresTypes.id'
        }
      }
    }
  }
}

module.exports = Domaines
