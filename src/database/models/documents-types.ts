import { Model } from 'objection'
import { join } from 'path'

import { IDocumentType } from '../../types'

interface DocumentsTypes extends IDocumentType {}

class DocumentsTypes extends Model {
  public static tableName = 'documentsTypes'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: 'string', maxLength: 128 },
      description: { type: ['string', 'null'] }
    }
  }

  public static relationMappings = {
    activitesTypes: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'activites-types'),
      join: {
        from: 'documentsTypes.id',
        through: {
          from: 'activitesTypes__documentsTypes.documentTypeId',
          to: 'activitesTypes__documentsTypes.activiteTypeId',
          extra: ['optionnel']
        },
        to: 'activitesTypes.id'
      }
    },

    etapesTypes: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'etapes-types'),
      join: {
        from: 'documentsTypes.id',
        through: {
          from: 'etapesTypes__documentsTypes.documentTypeId',
          to: 'etapesTypes__documentsTypes.etapeTypeId',
          extra: ['optionnel']
        },
        to: 'etapesTypes.id'
      }
    },

    travauxEtapesTypes: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'travaux-etapes-types'),
      join: {
        from: 'documentsTypes.id',
        through: {
          from: 'etapesTypes__documentsTypes.documentTypeId',
          to: 'etapesTypes__documentsTypes.travauxEtapeTypeId',
          extra: ['optionnel']
        },
        to: 'travauxEtapesTypes.id'
      }
    }
  }
}

export default DocumentsTypes
