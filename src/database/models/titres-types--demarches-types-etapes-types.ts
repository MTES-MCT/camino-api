import { Model } from 'objection'
import { ITitreTypeDemarcheTypeEtapeType } from '../../types'
import EtapesTypes from './etapes-types'
import DocumentsTypes from './documents-types'
import DemarchesTypes from './demarches-types'

interface TitresTypesDemarchesTypesEtapesTypes
  extends ITitreTypeDemarcheTypeEtapeType {}

class TitresTypesDemarchesTypesEtapesTypes extends Model {
  public static tableName = 'titresTypes__demarchesTypes__etapesTypes'

  public static jsonSchema = {
    type: 'object',
    required: ['titreTypeId', 'demarcheTypeId', 'etapeTypeId', 'ordre'],

    properties: {
      titreTypeId: { type: 'string', maxLength: 3 },
      demarcheTypeId: { type: 'string', maxLength: 3 },
      etapeTypeId: { type: 'string', maxLength: 3 },
      ordre: { type: 'integer' },
      sections: {}
    }
  }

  public static idColumn = ['titreTypeId', 'demarcheTypeId', 'etapeTypeId']

  static relationMappings = () => ({
    etapeType: {
      relation: Model.BelongsToOneRelation,
      modelClass: EtapesTypes,
      join: {
        from: 'titresTypes__demarchesTypes__etapesTypes.etapeTypeId',
        to: 'etapesTypes.id'
      }
    },

    demarcheType: {
      relation: Model.BelongsToOneRelation,
      modelClass: DemarchesTypes,
      join: {
        from: 'titresTypes__demarchesTypes__etapesTypes.demarcheTypeId',
        to: 'demarchesTypes.id'
      }
    },

    documentsTypes: {
      relation: Model.ManyToManyRelation,
      modelClass: DocumentsTypes,
      join: {
        from: [
          'titresTypes__demarchesTypes__etapesTypes.titreTypeId',
          'titresTypes__demarchesTypes__etapesTypes.demarcheTypeId',
          'titresTypes__demarchesTypes__etapesTypes.etapeTypeId'
        ],
        through: {
          from: [
            'titresTypes__demarchesTypes__etapesTypes__documentsTypes.titreTypeId',
            'titresTypes__demarchesTypes__etapesTypes__documentsTypes.demarcheTypeId',
            'titresTypes__demarchesTypes__etapesTypes__documentsTypes.etapeTypeId'
          ],
          to: 'titresTypes__demarchesTypes__etapesTypes__documentsTypes.documentTypeId',
          extra: ['optionnel']
        },
        to: 'documentsTypes.id'
      }
    },

    justificatifsTypes: {
      relation: Model.ManyToManyRelation,
      modelClass: DocumentsTypes,
      join: {
        from: [
          'titresTypes__demarchesTypes__etapesTypes.titreTypeId',
          'titresTypes__demarchesTypes__etapesTypes.demarcheTypeId',
          'titresTypes__demarchesTypes__etapesTypes.etapeTypeId'
        ],
        through: {
          from: [
            'titresTypes__demarchesTypes__etapesTypes__justificatifsT.titreTypeId',
            'titresTypes__demarchesTypes__etapesTypes__justificatifsT.demarcheTypeId',
            'titresTypes__demarchesTypes__etapesTypes__justificatifsT.etapeTypeId'
          ],
          to: 'titresTypes__demarchesTypes__etapesTypes__justificatifsT.documentTypeId',
          extra: ['optionnel']
        },
        to: 'documentsTypes.id'
      }
    }
  })
}

export default TitresTypesDemarchesTypesEtapesTypes
