import { Model } from 'objection'

export default class TitresTravauxRapports extends Model {
  static tableName = 'titresTravauxRapports'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'titreId', 'date', 'contenu'],
    properties: {
      id: { type: 'string' },
      titreId: { type: 'string' },
      date: { type: 'date' },
      confirmation: { type: 'boolean' },
      contenu: { type: 'json' }
    }
  }
}
