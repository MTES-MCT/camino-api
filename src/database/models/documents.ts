import { Model, Pojo } from 'objection'

import { IDocument } from '../../types'
import DocumentsTypes from './documents-types'
import TitresEtapes from './titres-etapes'
import TitresActivites from './titres-activites'
import Entreprises from './entreprises'

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

  static relationMappings = () => ({
    type: {
      relation: Model.BelongsToOneRelation,
      modelClass: DocumentsTypes,
      join: {
        from: 'documents.typeId',
        to: 'documentsTypes.id'
      }
    },

    etape: {
      relation: Model.HasOneRelation,
      modelClass: TitresEtapes,
      join: {
        from: 'documents.titreEtapeId',
        to: 'titresEtapes.id'
      }
    },

    activite: {
      relation: Model.HasOneRelation,
      modelClass: TitresActivites,
      join: {
        from: 'documents.titreActiviteId',
        to: 'titresActivites.id'
      }
    },

    entreprise: {
      relation: Model.HasOneRelation,
      modelClass: Entreprises,
      join: {
        from: 'documents.entrepriseId',
        to: 'entreprises.id'
      }
    },

    // justificatifs
    etapesAssociees: {
      relation: Model.ManyToManyRelation,
      modelClass: TitresEtapes,
      join: {
        from: 'documents.id',
        through: {
          from: 'titresEtapesJustificatifs.documentId',
          to: 'titresEtapesJustificatifs.titreEtapeId'
        },
        to: 'titresEtapes.id'
      }
    }
  })

  public $formatDatabaseJson(json: Pojo): Pojo {
    delete json.modification
    delete json.suppression
    delete json.fichierNouveau
    delete json.nomTemporaire
    json = super.$formatDatabaseJson(json)

    return json
  }

  public $parseJson(json: Pojo): Pojo {
    delete json.modification
    delete json.suppression
    delete json.fichierNouveau
    delete json.nomTemporaire
    json = super.$parseJson(json)

    return json
  }
}

export default Document
