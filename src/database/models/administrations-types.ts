import { Model, Modifiers } from 'objection'

import { IAdministrationsTypes } from '../../types'

interface AdministrationsTypes extends IAdministrationsTypes {}

class AdministrationsTypes extends Model {
  public static tableName = 'administrationsTypes'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom', 'ordre'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: ['string', 'null'], maxLength: 128 },
      ordre: { type: 'integer' }
    }
  }

  public static modifiers: Modifiers = {
    orderAsc: builder => {
      builder.orderBy('ordre', 'asc')
    }
  }
}

export default AdministrationsTypes
