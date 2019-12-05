import { Model } from 'objection'
import DocumentsTypes from './documents-types'

export default class TitresDocuments extends Model {
  static tableName = 'titresDocuments'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'typeId', 'titreEtapeId'],

    properties: {
      id: { type: 'string' },
      titreEtapeId: { type: 'string', maxLength: 128 },
      typeId: { type: 'string' },
      jorf: { type: ['string', 'null'] },
      nor: { type: ['string', 'null'] },
      url: { type: ['string', 'null'] },
      uri: { type: ['string', 'null'] },
      nom: { type: ['string', 'null'] },
      fichier: { type: ['boolean', 'null'] },
      fichierTypeId: { type: ['string', 'null'] },
      public: { type: ['boolean', 'null'] }
    }
  }

  static relationMappings = {
    type: {
      relation: Model.BelongsToOneRelation,
      modelClass: DocumentsTypes,
      join: {
        from: 'titresDocuments.typeId',
        to: 'documentsTypes.id'
      }
    }
  }
}
