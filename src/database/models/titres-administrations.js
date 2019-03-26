import { Model } from 'objection'

export default class TitresAdministrations extends Model {
  static tableName = 'titresAdministrations'

  static jsonSchema = {
    type: 'object',
    required: ['titreEtapeId', 'administrationId'],

    properties: {
      administrationId: { type: 'string', maxLength: 64 },
      titreEtapeId: { type: 'string', maxLength: 128 },
      coordinateur: { type: ['boolean', 'null'] }
    }
  }

  static idColumn = ['administrationId', 'titreEtapeId']
}
