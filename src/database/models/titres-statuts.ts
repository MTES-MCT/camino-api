import { Model, Modifiers } from 'objection'

import { ITitreStatut } from '../../types'

interface TitresStatuts extends ITitreStatut {}

class TitresStatuts extends Model {
  public static tableName = 'titresStatuts'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom', 'couleur'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: 'string' },
      couleur: { type: 'string', maxLength: 8 },
      ordre: { type: 'integer' }
    }
  }

  public static modifiers: Modifiers = {
    orderAsc: builder => {
      builder.orderBy('ordre', 'asc')
    }
  }
}

export default TitresStatuts
