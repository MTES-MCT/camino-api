import { Model } from 'objection'

import { ISubstanceLegale } from '../../types'

import SubstancesFiscales from './substances-fiscales'
import SubstancesLegalesCodes from './substances-legales-codes'
import Domaines from './domaines'

interface SubstancesLegales extends ISubstanceLegale {}

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
      substanceLegaleCodeId: { type: ['string', 'null'] }
    }
  }

  static relationMappings = () => ({
    code: {
      relation: Model.BelongsToOneRelation,
      modelClass: SubstancesLegalesCodes,
      join: {
        from: 'substancesLegales.substanceLegaleCodeId',
        to: 'substancesLegalesCodes.id'
      }
    },

    domaine: {
      relation: Model.BelongsToOneRelation,
      modelClass: Domaines,
      join: {
        from: 'substancesLegales.domaineId',
        to: 'domaines.id'
      }
    },

    fiscales: {
      relation: Model.HasManyRelation,
      modelClass: SubstancesFiscales,
      join: {
        from: 'substancesLegales.id',
        to: 'substancesFiscales.substanceLegaleId'
      }
    }
  })
}

export default SubstancesLegales
