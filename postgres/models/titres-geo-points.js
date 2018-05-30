const { Model } = require('objection')
const knex = require('../')

class GeoPoints extends Model {
  static get tableName() {
    return 'titresGeoPoints'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'coordonees', 'groupe', 'contour', 'point'],

      properties: {
        id: { type: 'string' },
        coordonees: {
          type: 'object',
          properties: {
            x: { type: 'number' },
            y: { type: 'number' }
          }
        },
        groupe: { type: 'integer' },
        contour: { type: 'integer' },
        point: { type: 'integer' },
        nom: { type: 'string' },
        reference: { type: ['string', 'null'] },
        referenceValeur: {
          type: ['array', 'null'],
          properties: { type: 'number' }
        }
      }
    }
  }

  // bug: lorsqu'on importe
  $formatDatabaseJson(json) {
    if (json.coordonees) {
      console.log('boum', json.coordonees)
      const t = knex.raw('point(?, ?)', [json.coordonees.x, json.coordonees.y])
      json.coordonees = t
    }
    json = super.$formatDatabaseJson(json)
    return json
  }

  $parseDatabaseJson(json) {
    // Remember to call the super class's implementation.
    json = super.$parseDatabaseJson(json)
    if (json) {
      // console.log('--------------->', json)
    }
    return json
  }
}

module.exports = GeoPoints
