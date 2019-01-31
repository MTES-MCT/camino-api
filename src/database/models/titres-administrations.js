import { Model } from 'objection'
import Administrations from './administrations'

export default class TitresAdministrations extends Model {
  static tableName = 'titresAdministrations'

  static jsonSchema = {
    type: 'object',
    required: ['administrationId', 'titreEtapeId'],

    properties: {
      administrationId: { type: 'string', maxLength: 64 },
      titreEtapeId: { type: 'string', maxLength: 128 }
    }
  }

  static relationMappings = {
    substance: {
      relation: Model.BelongsToOneRelation,
      modelClass: Administrations,
      join: {
        from: 'titresAdministrations.administrationId',
        to: 'administrations.id'
      }
    }
  }

  static idColumn = ['administrationId', 'titreEtapeId']
}
