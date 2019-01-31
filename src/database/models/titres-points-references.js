import { Model } from 'objection'

export default class TitresPointsReferences extends Model {
  static tableName = 'titresPointsReferences'

  static jsonSchema = {
    type: 'object',
    required: ['titrePointId', 'id', 'systeme', 'coordonnees'],

    properties: {
      id: { type: 'string' },
      titrePointId: { type: 'string' },
      systeme: { type: 'string' },
      coordonnees: {
        type: 'object',
        properties: {
          x: { type: 'float' },
          y: { type: 'float' }
        }
      }
    }
  }
}
