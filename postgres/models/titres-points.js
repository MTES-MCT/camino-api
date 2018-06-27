const { Model } = require('objection')
const knex = require('../index.js')
const TitresPointsReferences = require('./titres-points-references')

class TitresPoints extends Model {
  static get tableName() {
    return 'titres_points'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: [
        'id',
        'titre_demarche_etape_id',
        'coordonees',
        'groupe',
        'contour',
        'point'
      ],

      properties: {
        id: { type: 'string' },
        titre_demarche_etape_id: { type: 'string', maxLength: 128 },
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
          from: 'titres_points.id',
          to: 'titres_points_references.titre_point_id'
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
