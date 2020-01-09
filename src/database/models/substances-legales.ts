import { Model } from 'objection'
import Domaines from './domaines'
import SubstancesLegalesCodes from './substances-legales-codes'

export default class SubstancesLegales extends Model {
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

  public id!: string
  public nom!: string
  public domaineId?: string
  public description?: string
  public substanceLegalCodeId?: string
  public domaine?: Domaines
  public code?: SubstancesLegalesCodes
}
