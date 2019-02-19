import { Model } from 'objection'

export default class VolumeUnites extends Model {
  static tableName = 'volumeUnites'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: 'string' }
    }
  }
}
