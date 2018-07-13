const { Model } = require('objection')

class TitresPointsReferences extends Model {
  static get tableName() {
    return 'titresPointsReferences'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['titrePointId', 'id', 'systeme', 'coordonees'],

      properties: {
        id: { type: 'string' },
        titrePointId: { type: 'string' },
        systeme: { type: 'string' },
        coordonees: {
          type: 'object',
          properties: {
            x: { type: 'number' },
            y: { type: 'number' }
          }
        }
      }
    }
  }
}

module.exports = TitresPointsReferences
