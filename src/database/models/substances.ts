import { Model, Modifiers } from 'objection'
import { join } from 'path'

import { ISubstance } from '../../types'

interface Substances extends ISubstance {}

class Substances extends Model {
  public static tableName = 'substances'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom', 'substanceLegaleId'],

    properties: {
      id: { type: 'string' },
      nom: { type: ['string', 'null'] },
      symbole: { type: ['string', 'null'] },
      gerep: { type: ['integer', 'null'] },
      description: { type: ['string', 'null'], maxLength: 2048 },
      substanceLegaleId: { type: 'string' }
    }
  }

  public static relationMappings = {
    legales: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, './substances-legales'),
      join: {
        from: 'substances.id',
        through: {
          from: 'substances__substancesLegales.substanceId',
          to: 'substances__substancesLegales.substanceLegaleId'
        },
        to: 'substancesLegales.id'
      }
    }
  }

  public static modifiers: Modifiers = {
    orderAsc: builder => {
      builder.orderBy('ordre', 'asc')
    }
  }
}

export default Substances
