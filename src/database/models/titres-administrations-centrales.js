import { Model } from 'objection'

export default class TitresAdministrationsCentrales extends Model {
  static tableName = 'titresAdministrationsCentrales'

  static jsonSchema = {
    type: 'object',
    required: ['titreId', 'administrationId'],

    properties: {
      administrationId: { type: 'string', maxLength: 64 },
      titreId: { type: 'string', maxLength: 128 },
      subsidiaire: { type: ['boolean', 'null'] }
    }
  }

  static idColumn = ['administrationId', 'titreId']
}
