import { Model } from 'objection'

export default class TitresAdministrationsLocales extends Model {
  public static tableName = 'titresAdministrationsLocales'

  public static jsonSchema = {
    type: 'object',
    required: ['titreEtapeId', 'administrationId'],

    properties: {
      administrationId: { type: 'string', maxLength: 64 },
      titreEtapeId: { type: 'string', maxLength: 128 },
      associee: { type: ['boolean', 'null'] },
      coordinateur: { type: ['boolean', 'null'] }
    }
  }

  public static idColumn = ['administrationId', 'titreEtapeId']

  public administrationId!: string
  public titreId!: string
  public associee?: boolean
  public coordinateur?: boolean
}
