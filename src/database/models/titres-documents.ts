import { Model } from 'objection'
import DocumentsTypes from './documents-types'

export default class TitresDocuments extends Model {
  public static tableName = 'titresDocuments'

  public static jsonSchema = {
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

  public static relationMappings = {
    type: {
      relation: Model.BelongsToOneRelation,
      modelClass: DocumentsTypes,
      join: {
        from: 'titresDocuments.typeId',
        to: 'documentsTypes.id'
      }
    }
  }

  public id!: string
  public titreEtapeId!: string
  public typeId!: string
  public jorf?: string
  public nor?: string
  public url?: string
  public uri?: string
  public nom?: string
  public fichier?: boolean
  public fichierTypeId?: string
  public public?: boolean
  public type!: DocumentsTypes
}
