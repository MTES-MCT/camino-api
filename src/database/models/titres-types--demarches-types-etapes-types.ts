import { Model } from 'objection'
import { ITitreTypeDemarcheTypeEtapeType } from '../../types'
import EtapesTypes from './etapes-types'
import { join } from 'path'

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
      sections: { type: 'json' }
    }
  }

  public static idColumn = ['titreTypeId', 'demarcheTypeId', 'etapeTypeId']

  public static relationMappings = {
    etapeType: {
      relation: Model.BelongsToOneRelation,
      modelClass: EtapesTypes,
      join: {
        from: 'titresTypes__demarchesTypes__etapesTypes.etapeTypeId',
        to: 'etapesTypes.id'
      }
    },

    documentsTypes: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'documents-types'),
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
      modelClass: join(__dirname, 'documents-types'),
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
  }
}

export default TitresTypesDemarchesTypesEtapesTypes
