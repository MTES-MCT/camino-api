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
      dateDebut: { type: 'date' },
      dateFin: { type: 'date' }
    }
  }

  static namedFilters = {
    orderDesc: builder => {
      builder.orderBy('dateDebut', 'desc')
    }
  }
}
