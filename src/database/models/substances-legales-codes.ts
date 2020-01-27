import { Model } from 'objection'

import { ISubstancesLegalesCodes } from '../../types'

interface SubstancesLegalesCodes extends ISubstancesLegalesCodes {}

class SubstancesLegalesCodes extends Model {
  public static tableName = 'substancesLegalesCodes'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom', 'lien'],

    properties: {
      id: { type: 'string' },
      nom: { type: ['string', 'null'] },
      description: { type: ['string', 'null'] },
      lien: { type: ['string', 'null'] }
    }
  }
}

export default SubstancesLegalesCodes
