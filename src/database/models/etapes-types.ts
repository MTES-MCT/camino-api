import { Model, Modifiers } from 'objection'

import { IEtapeType } from '../../types'
import EtapesStatuts from './etapes-statuts'
import AdministrationsTitresTypesEtapesTypes from './administrations-titres-types-etapes-types'
import DocumentsTypes from './documents-types'

interface EtapesTypes extends IEtapeType {}

class EtapesTypes extends Model {
  public static tableName = 'etapesTypes'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: 'string', maxLength: 128 },
      description: { type: ['string', 'null'] },
      acceptationAuto: { type: ['boolean', 'null'] },
      fondamentale: { type: ['boolean', 'null'] },
      dateDebut: { type: ['string', 'null'] },
      dateFin: { type: ['string', 'null'] },
      sections: {},
      unique: { type: ['boolean', 'null'] },
      ordre: { type: 'integer' },
      publicLecture: { type: 'boolean' },
      entreprisesLecture: { type: 'boolean' }
    }
  }

  static relationMappings = () => ({
    etapesStatuts: {
      relation: Model.ManyToManyRelation,
      modelClass: EtapesStatuts,
      join: {
        from: 'etapesTypes.id',
        through: {
          from: 'etapesTypes__etapesStatuts.etapeTypeId',
          to: 'etapesTypes__etapesStatuts.etapeStatutId',
          extra: ['ordre']
        },
        to: 'etapesStatuts.id'
      }
    },

    administrations: {
      relation: Model.HasManyRelation,
      modelClass: AdministrationsTitresTypesEtapesTypes,
      join: {
        from: 'etapesTypes.id',
        to: 'administrations__titresTypes__etapesTypes.etapeTypeId'
      }
    },

    documentsTypes: {
      relation: Model.ManyToManyRelation,
      modelClass: DocumentsTypes,
      join: {
        from: 'etapesTypes.id',
        through: {
          from: 'etapesTypes__documentsTypes.etapeTypeId',
          to: 'etapesTypes__documentsTypes.documentTypeId',
          extra: {
            optionnel: 'optionnel',
            descriptionSpecifique: 'description'
          }
        },
        to: 'documentsTypes.id'
      }
    },

    justificatifsTypes: {
      relation: Model.ManyToManyRelation,
      modelClass: DocumentsTypes,
      join: {
        from: 'etapesTypes.id',
        through: {
          from: 'etapesTypes__justificatifsTypes.etapeTypeId',
          to: 'etapesTypes__justificatifsTypes.documentTypeId',
          extra: {
            optionnel: 'optionnel',
            descriptionSpecifique: 'description'
          }
        },
        to: 'documentsTypes.id'
      }
    }
  })

  public static modifiers: Modifiers = {
    orderAsc: builder => {
      builder.orderBy('etapesTypes.ordre', 'asc')
    }
  }
}

export default EtapesTypes
