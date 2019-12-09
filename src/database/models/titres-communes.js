import { Model } from 'objection'

export default class TitresCommunes extends Model {
  static tableName = 'titresCommunes'

  static jsonSchema = {
    type: 'object',
    required: ['titreEtapeId', 'communeId'],

    properties: {
      communeId: { type: 'string', maxLength: 8 },
      titreEtapeId: { type: 'string', maxLength: 128 },
      surface: { type: 'number' }
    }
  }

  static idColumn = ['communeId', 'titreEtapeId']
}
