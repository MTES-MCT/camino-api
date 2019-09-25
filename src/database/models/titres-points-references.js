import { Model } from 'objection'
import GeoSystemes from './geo-systemes'
import Unites from './unites'

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
          x: { type: 'number' },
          y: { type: 'number' }
        }
      },
      uniteId: { type: 'string' },
      opposable: { type: ['boolean', 'null'] }
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
    },

    unite: {
      relation: Model.BelongsToOneRelation,
      modelClass: Unites,
      join: {
        from: 'titresPointsReferences.uniteId',
        to: 'unites.id'
      }
    }
  }

  $parseJson(json) {
    json = super.$parseJson(json)

    if (!json.id && json.titrePointId && json.geoSystemeId) {
      json.id = `${json.titrePointId}-${json.geoSystemeId}`
    }

    return json
  }

  $formatDatabaseJson(json) {
    if (json.coordonnees) {
      json.coordonnees = `${json.coordonnees.x},${json.coordonnees.y}`
    }

    json = super.$formatDatabaseJson(json)

    return json
  }

  static jsonAttributes = []
}
