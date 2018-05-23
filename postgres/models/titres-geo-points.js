const { Model } = require('objection')

class GeoPoints extends Model {
  static get tableName() {
    return 'titresGeoPoints'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'nom', 'domaine', 'type', 'usage', 'legalId'],

      properties: {
        id: { type: 'string' }
      }
    }
  }
}

module.exports = GeoPoints
