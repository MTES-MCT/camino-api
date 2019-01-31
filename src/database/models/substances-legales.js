import { Model } from 'objection'
import SubstancesLegalesCodes from './substances-legales-codes'
import Domaines from './domaines'

export default class SubstancesLegales extends Model {
  static tableName = 'substancesLegales'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'nom', 'lien'],

    properties: {
      id: { type: 'string' },
      nom: { type: ['string', 'null'] },
      domaineId: { type: ['string', 'null'] },
      description: { type: ['string', 'null'] },
      substanceLegalCodeId: { type: ['string', 'null'] }
    }
  }

  static relationMappings = {
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
    }
  }
}
