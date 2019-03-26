import { Model } from 'objection'
import AdministrationsStatuts from './administrations-statuts'

export default class AdministrationsTypes extends Model {
  static tableName = 'administrationsTypes'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: {
        type: ['string', 'null'],
        maxLength: 128
      }
    }
  }
}
