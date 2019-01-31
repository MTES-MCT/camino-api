import { Model } from 'objection'
import Emprises from './emprises'

export default class TitresEmprises extends Model {
  static tableName = 'titresEmprises'

  static jsonSchema = {
    type: 'object',
    required: ['empriseId', 'titreEtapeId'],

    properties: {
      empriseId: { type: 'string', maxLength: 3 },
      titreEtapeId: { type: 'string', maxLength: 128 }
    }
  }

  static relationMappings = {
    emprise: {
      relation: Model.BelongsToOneRelation,
      modelClass: Emprises,
      join: {
        from: 'titresEmprises.empriseId',
        to: 'emprises.id'
      }
    }
  }

  static idColumn = ['empriseId', 'titreEtapeId']
}
