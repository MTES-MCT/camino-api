import { Model } from 'objection'
import GeoSystemes from './geo-systemes'

export default class TitresPointsReferences extends Model {
  static tableName = 'titresPointsReferences'

  static jsonSchema = {
    type: 'object',
    required: ['titrePointId', 'id', 'systeme', 'coordonnees'],

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
}
