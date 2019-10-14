import { Model } from 'objection'

export default class EntreprisesEtablissements extends Model {
  static tableName = 'entreprisesEtablissements'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'entrepriseId'],

    properties: {
      id: { type: 'string', maxLength: 64 },
      entrepriseId: { type: 'string', maxLength: 64 },
      nom: { type: ['string', 'null'] },
      legalSiret: { type: ['string', 'null'] },
      dateDebut: { type: 'string' },
      dateFin: { type: ['string', 'null'] }
    }
  }

  static modifiers = {
    orderDesc: builder => {
      builder.orderBy('dateDebut', 'desc')
    }
  }
}
