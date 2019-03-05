import { Model } from 'objection'

export default class TitresActivites extends Model {
  static tableName = 'titresActivites'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'titreId', 'date', 'contenu'],
    properties: {
      id: { type: 'string' },
      titreId: { type: 'string' },
      utilisateurId: { type: 'string' },
      date: { type: 'date' },
      confirmation: { type: 'boolean' },
      contenu: { type: 'json' }
    }
  }
}
