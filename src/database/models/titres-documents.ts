import { Model, Pojo } from 'objection'
import { join } from 'path'
import { ITitreDocument } from '../../types'

interface TitresDocuments extends ITitreDocument {}
class TitresDocuments extends Model {
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
      description: { type: ['string', 'null'] },
      fichier: { type: ['boolean', 'null'] },
      fichierTypeId: { type: ['string', 'null'] },
      public: { type: ['boolean', 'null'] }
    }
  }

  public static relationMappings = {
    type: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'documents-types'),
      join: {
        from: 'titresDocuments.typeId',
        to: 'documentsTypes.id'
      }
    },

    etape: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'titres-etapes'),
      join: {
        from: 'titresDocuments.titreEtapeId',
        to: 'titresEtapes.id'
      }
    }
  }

  public $formatDatabaseJson(json: Pojo) {
    json = super.$formatDatabaseJson(json)

    delete json.modification
    delete json.suppression

    return json
  }

  public $parseJson(json: Pojo) {
    json = super.$parseJson(json)

    delete json.modification
    delete json.suppression

    return json
  }
}

export default TitresDocuments
