const { Model } = require('objection')

class TitresPointsReferences extends Model {
  static get tableName() {
    return 'titres_points_references'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['titre_point_id', 'id', 'systeme', 'coordonees'],

      properties: {
        id: { type: 'string' },
        titre_point_id: { type: 'string' },
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
