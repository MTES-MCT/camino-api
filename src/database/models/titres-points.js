import { Model } from 'objection'
import TitresPointsReferences from './titres-points-references'

export default class TitresPoints extends Model {
  static tableName = 'titresPoints'

  static jsonSchema = {
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
          x: { type: 'number' },
          y: { type: 'number' }
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

  static relationMappings = {
    references: {
      relation: Model.HasManyRelation,
      modelClass: TitresPointsReferences,
      join: {
        from: 'titresPoints.id',
        to: 'titresPointsReferences.titrePointId'
      }
    }
  }

  $formatDatabaseJson(json) {
    if (json.coordonnees) {
      json.coordonnees = `${json.coordonnees.x},${json.coordonnees.y}`
    }

    json = super.$formatDatabaseJson(json)
    return json
  }
}
