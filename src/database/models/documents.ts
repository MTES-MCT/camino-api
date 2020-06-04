import { Model, Pojo } from 'objection'
import { join } from 'path'
import { IDocument } from '../../types'

interface Document extends IDocument {}
class Document extends Model {
  public static tableName = 'documents'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'typeId', 'date'],

    properties: {
      id: { type: 'string' },
      typeId: { type: 'string' },
      date: { type: 'string' },
      titreEtapeId: { type: ['string', 'null'] },
      titreActiviteId: { type: ['string', 'null'] },
      entrepriseId: { type: ['string', 'null'] },
      description: { type: ['string', 'null'] },
      fichier: { type: ['boolean', 'null'] },
      fichierTypeId: { type: ['string', 'null'] },
      url: { type: ['string', 'null'] },
      uri: { type: ['string', 'null'] },
      jorf: { type: ['string', 'null'] },
      nor: { type: ['string', 'null'] },
      publicLecture: { type: ['boolean', 'null'] },
      entreprisesLecture: { type: ['boolean', 'null'] }
    }
  }

  public static relationMappings = {
    type: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'documents-types'),
      join: {
        from: 'documents.typeId',
        to: 'documentsTypes.id'
      }
    },

    etape: {
      relation: Model.HasOneRelation,
      modelClass: join(__dirname, 'titres-etapes'),
      join: {
        from: 'documents.titreEtapeId',
        to: 'titresEtapes.id'
      }
    },

    activite: {
      relation: Model.HasOneRelation,
      modelClass: join(__dirname, 'titres-activites'),
      join: {
        from: 'documents.titreActiviteId',
        to: 'titresActivites.id'
      }
    },

    entreprise: {
      relation: Model.HasOneRelation,
      modelClass: join(__dirname, 'entreprises'),
      join: {
        from: 'documents.entrepriseId',
        to: 'entreprises.id'
      }
    },

    // justificatifs
    etapesAssociees: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'titres-etapes'),
      join: {
        from: 'documents.id',
        through: {
          from: 'titresEtapesJustificatifs.documentId',
          to: 'titresEtapesJustificatifs.titreEtapeId'
        },
        to: 'titresEtapes.id'
      }
    }
  }

  public $formatDatabaseJson(json: Pojo): Pojo {
    json = super.$formatDatabaseJson(json)

    delete json.modification
    delete json.suppression

    return json
  }

  public $parseJson(json: Pojo): Pojo {
    json = super.$parseJson(json)

    delete json.modification
    delete json.suppression

    return json
  }
}

export default Document
