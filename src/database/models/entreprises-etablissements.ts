import { Model, Modifiers } from 'objection'

export default class EntreprisesEtablissements extends Model {
  public static tableName = 'entreprisesEtablissements'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'entrepriseId', 'dateDebut'],

    properties: {
      id: { type: 'string', maxLength: 64 },
      entrepriseId: { type: 'string', maxLength: 64 },
      nom: { type: ['string', 'null'] },
      legalSiret: { type: ['string', 'null'] },
      dateDebut: { type: 'string' },
      dateFin: { type: ['string', 'null'] }
    }
  }

  public static modifiers: Modifiers = {
    orderDesc: builder => {
      builder.orderBy('dateDebut', 'desc')
    }
  }

  public id!: string
  public entrepriseId!: string
  public nom?: string
  public legalSiret?: string
  public dateDebut!: string
  public dateFin?: string
}
