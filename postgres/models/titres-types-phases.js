const { Model } = require('objection')

class Phases extends Model {
  static get tableName() {
    return 'titresTypesPhases'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id'],

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
        dureeMax: {
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
