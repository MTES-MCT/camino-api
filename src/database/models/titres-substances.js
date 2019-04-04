import { Model } from 'objection'
import Substances from './substances'

export default class TitresSubstances extends Model {
  static tableName = 'titresSubstances'

  static jsonSchema = {
    type: 'object',
    required: ['substanceId', 'titreEtapeId'],

    properties: {
      substanceId: { type: 'string', maxLength: 4 },
      titreEtapeId: { type: 'string', maxLength: 128 },
      connexe: { type: ['boolean', 'null'] },
      ordre: { type: ['integer', 'null'] }
    }
  }

  static relationMappings = {
    substance: {
      relation: Model.BelongsToOneRelation,
      modelClass: Substances,
      join: {
        from: 'titresSubstances.substanceId',
        to: 'substances.id'
      }
    }
  }

  static idColumn = ['substanceId', 'titreEtapeId']
}
