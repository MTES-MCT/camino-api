const { Model } = require('objection')
const knex = require('../index.js')
const TitresPointsReferences = require('./titres-points-references')

class TitresPoints extends Model {
  static get tableName() {
    return 'titresPoints'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'id',
        'titreEtapeId',
        'coordonees',
        'groupe',
        'contour',
        'point'
      ],

      properties: {
        id: { type: 'string' },
        titreEtapeId: { type: 'string', maxLength: 128 },
        coordonees: {
          type: 'object',
          properties: {
            x: { type: 'float' },
            y: { type: 'float' }
          }
        },
        groupe: { type: 'integer' },
        contour: { type: 'integer' },
        point: { type: 'integer' },
        nom: { type: 'string' },
        description: { type: 'string' },
        securite: { type: 'boolean' }
      }
    }
  }

  static get relationMappings() {
    return {
      references: {
        relation: Model.HasManyRelation,
        modelClass: TitresPointsReferences,
        join: {
          from: 'titresPoints.id',
          to: 'titresPointsReferences.titrePointId'
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

module.exports = TitresPoints
