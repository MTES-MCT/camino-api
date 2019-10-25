import { Model } from 'objection'

export default class TitresAdministrationsLocales extends Model {
  static tableName = 'titresAdministrationsLocales'

  static jsonSchema = {
    type: 'object',
    required: ['titreEtapeId', 'administrationId'],

    properties: {
      administrationId: { type: 'string', maxLength: 64 },
      titreEtapeId: { type: 'string', maxLength: 128 },
      subsidiaire: { type: ['boolean', 'null'] },
      coordinateur: { type: ['boolean', 'null'] }
    }
  }

  static idColumn = ['administrationId', 'titreEtapeId']
}
