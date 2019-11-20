import { Model } from 'objection'

export default class TitresAdministrationsGestionnaires extends Model {
  static tableName = 'titresAdministrationsGestionnaires'

  static jsonSchema = {
    type: 'object',
    required: ['titreId', 'administrationId'],

    properties: {
      administrationId: { type: 'string', maxLength: 64 },
      titreId: { type: 'string', maxLength: 128 },
      associee: { type: ['boolean', 'null'] }
    }
  }

  static idColumn = ['administrationId', 'titreId']
}
