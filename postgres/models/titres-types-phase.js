const { Model } = require('objection')
const Type = require('./titres-type')

class Phases extends Model {
  static get tableName() {
    return 'titres_types'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'nom'],

      properties: {
        id: { type: 'string', maxLength: 8 },
        nom: {
          type: 'string',
          enum: [
            'octroi',
            'prolongation',
            'prolongation 1',
            'prolongation 2',
            'prolongation exceptionnelle'
          ]
        },
        duree: {
          type: 'integer'
        },
        position: {
          type: 'integer'
        },
        renouvelable: {
          type: 'boolean'
        },
        exception: {
          type: 'boolean'
        }
      }
    }
  }
}

module.exports = Phases
