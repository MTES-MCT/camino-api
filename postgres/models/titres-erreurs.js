const { Model } = require('objection')

class TitresErreurs extends Model {
  static get tableName() {
    return 'titresErreurs'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'titreDemarcheId'],

      properties: {
        titreEtapeId: { type: 'string', maxLength: 128 },
        date: { type: 'boolean' },
        duree: { type: 'boolean' },
        dateDebut: { type: 'boolean' },
        dateFin: { type: 'boolean' },
        surface: { type: 'boolean' },
        visas: { type: 'boolean' },
        engagement: { type: 'boolean' },
        engagementDevise: { type: 'boolean' },
        points: { type: 'boolean' },
        substances: { type: 'boolean' },
        titulaires: { type: 'boolean' },
        amodiataires: { type: 'boolean' },
        administrations: { type: 'boolean' }
      }
    }
  }
}

module.exports = TitresErreurs
