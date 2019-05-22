import { Model } from 'objection'

export default class AdministrationsTypes extends Model {
  static tableName = 'administrationsTypes'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'nom', 'ordre'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: {
        type: ['string', 'null'],
        maxLength: 128
      },
      ordre: { type: 'integer' }
    }
  }
}
