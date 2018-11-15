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
        'coordonnees',
        'groupe',
        'contour',
        'point'
      ],

      properties: {
        id: { type: 'string' },
        titreEtapeId: { type: 'string', maxLength: 128 },
        coordonnees: {
          type: 'object',
          properties: {
            x: { type: 'float' },
            y: { type: 'float' }
          }
        },
        groupe: { type: 'integer' },
        contour: { type: 'integer' },
        point: { type: 'integer' },
        nom: { type: ['string', 'null'] },
        description: { type: ['string', 'null'] },
        securite: { type: ['boolean', 'null'] }
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

  $formatDatabaseJson(json) {
    if (json.coordonnees) {
      const t = `${json.coordonnees.x},${json.coordonnees.y}`
      json.coordonnees = t
    }
    json = super.$formatDatabaseJson(json)
    return json
  }

  $parseDatabaseJson(json) {
    json = super.$parseDatabaseJson(json)
    if (json) {
      // console.log('--------------->', json)
    }
    return json
  }
}

module.exports = TitresPoints
