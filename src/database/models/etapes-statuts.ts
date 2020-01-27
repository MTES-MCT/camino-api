import { Model } from 'objection'

import { IEtapesStatuts } from '../../types'

interface EtapesStatuts extends IEtapesStatuts {}

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
}

export default EtapesStatuts
