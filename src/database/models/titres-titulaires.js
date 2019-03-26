import { Model } from 'objection'
import Entreprises from './entreprises'

export default class TitresTitulaires extends Model {
  static tableName = 'titresTitulaires'

  static jsonSchema = {
    type: 'object',
    required: ['entrepriseId', 'titreEtapeId'],

    properties: {
      entrepriseId: { type: 'string', maxLength: 64 },
      titreEtapeId: { type: 'string', maxLength: 128 },
      operateur: { type: ['boolean', 'null'] }
    }
  }

  static relationMappings = {
    entreprise: {
      relation: Model.BelongsToOneRelation,
      modelClass: Entreprises,
      join: {
        from: 'titresTitulaires.entrepriseId',
        to: 'entreprises.id'
      }
    }
  }
}
