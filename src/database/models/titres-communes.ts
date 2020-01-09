import { Model } from 'objection'

export default class TitresCommunes extends Model {
  public static tableName = 'titresCommunes'

  public static jsonSchema = {
    type: 'object',
    required: ['titreEtapeId', 'communeId'],

    properties: {
      communeId: { type: 'string', maxLength: 8 },
      titreEtapeId: { type: 'string', maxLength: 128 },
      surface: { type: 'number' }
    }
  }

  public static idColumn = ['communeId', 'titreEtapeId']

  public communeId!: string
  public titreEtapeId!: string
  public surface?: number
}
