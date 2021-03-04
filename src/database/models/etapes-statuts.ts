import { Model, Modifiers } from 'objection'

import { IEtapeStatut } from '../../types'

interface EtapesStatuts extends IEtapeStatut {}

class EtapesStatuts extends Model {
  public static tableName = 'etapesStatuts'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom', 'couleur'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: ['string', 'null'] },
      couleur: { type: ['string', 'null'], maxLength: 8 }
    }
  }

  public static modifiers: Modifiers = {
    orderAsc: builder => {
      builder.orderBy('ordre', 'asc')
    }
  }
}

export default EtapesStatuts
