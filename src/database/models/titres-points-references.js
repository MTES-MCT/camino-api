import { Model } from 'objection'
import GeoSystemes from './geo-systemes'

export default class TitresPointsReferences extends Model {
  static tableName = 'titresPointsReferences'

  static jsonSchema = {
    type: 'object',
    required: ['titrePointId', 'id', 'geoSystemeId', 'coordonnees'],

    properties: {
      id: { type: 'string' },
      titrePointId: { type: 'string' },
      geoSystemeId: { type: 'string' },
      coordonnees: {
        type: 'object',
        properties: {
          x: { type: 'string' },
          y: { type: 'string' }
        }
      }
    }
  }

  static relationMappings = {
    geoSysteme: {
      relation: Model.BelongsToOneRelation,
      modelClass: GeoSystemes,
      join: {
        from: 'titresPointsReferences.geoSystemeId',
        to: 'geoSystemes.id'
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
}
