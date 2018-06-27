const { Model } = require('objection')

class Demarches extends Model {
  static get tableName() {
    return 'demarches'
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
        duree_max: {
          type: 'integer'
        },
        ordre: {
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

module.exports = Demarches
