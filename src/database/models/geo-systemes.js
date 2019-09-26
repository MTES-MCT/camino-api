import { Model } from 'objection'

export default class GeoSystemes extends Model {
  static tableName = 'geoSystemes'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 5 },
      nom: { type: 'string' },
      type: { type: 'string' },
      zone: { type: 'string' }
    }
  }
}
