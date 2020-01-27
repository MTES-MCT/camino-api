import { Model } from 'objection'

import { IPhasesStatuts } from '../../types'

interface PhasesStatuts extends IPhasesStatuts {}

class PhasesStatuts extends Model {
  public static tableName = 'phasesStatuts'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom', 'couleur'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: 'string' },
      couleur: { type: 'string', maxLength: 8 }
    }
  }
}

export default PhasesStatuts
