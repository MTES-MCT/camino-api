import { Model } from 'objection'

export default class titresIncertitudes extends Model {
  static tableName = 'titresIncertitudes'

  static jsonSchema = {
    type: 'object',
    required: ['titreEtapeId'],

    properties: {
      titreEtapeId: { type: 'string', maxLength: 128 },
      date: { type: ['null', 'boolean'] },
      dateDebut: { type: ['null', 'boolean'] },
      dateFin: { type: ['null', 'boolean'] },
      duree: { type: ['null', 'boolean'] },
      surface: { type: ['null', 'boolean'] },
      volume: { type: ['null', 'boolean'] },
      engagement: { type: ['null', 'boolean'] },
      points: { type: ['null', 'boolean'] },
      substances: { type: ['null', 'boolean'] },
      titulaires: { type: ['null', 'boolean'] },
      amodiataires: { type: ['null', 'boolean'] },
      administrations: { type: ['null', 'boolean'] }
    }
  }

  static idColumn = 'titreEtapeId'
}
