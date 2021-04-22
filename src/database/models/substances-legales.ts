import { Model } from 'objection'
import { join } from 'path'

import { ISubstanceLegale } from '../../types'

import SubstancesFiscales from './substances-fiscales'

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
    },

    fiscales: {
      relation: Model.HasManyRelation,
      modelClass: SubstancesFiscales,
      join: {
        from: 'substancesLegales.id',
        to: 'substancesFiscales.substanceLegaleId'
      }
    }
  }
}

export default SubstancesLegales
