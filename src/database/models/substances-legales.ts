import { Model } from 'objection'
import { join } from 'path'

import { ISubstancesLegales } from '../../types'

interface SubstancesLegales extends ISubstancesLegales {}

class SubstancesLegales extends Model {
  public static tableName = 'substancesLegales'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string' },
      nom: { type: ['string', 'null'] },
      domaineId: { type: ['string', 'null'] },
      description: { type: ['string', 'null'] },
      substanceLegalCodeId: { type: ['string', 'null'] }
    }
  }

  public static relationMappings = {
    code: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'substances-legales-codes'),
      join: {
        from: 'substancesLegales.substanceLegaleCodeId',
        to: 'substancesLegalesCodes.id'
      }
    },
    domaine: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'domaines'),
      join: {
        from: 'substancesLegales.domaineId',
        to: 'domaines.id'
      }
    }
  }
}

export default SubstancesLegales
