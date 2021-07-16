import { Model } from 'objection'
import { ITitreTypeDemarcheTypeEtapeTypeDocumentType } from '../../types'

interface TitresTypesDemarchesTypesEtapesTypesDocumentsTypes
  extends ITitreTypeDemarcheTypeEtapeTypeDocumentType {}

class TitresTypesDemarchesTypesEtapesTypesDocumentsTypes extends Model {
  public static tableName =
    'titresTypes__demarchesTypes__etapesTypes__documentsTypes'

  public static jsonSchema = {
    type: 'object',
    required: [
      'titreTypeId',
      'demarcheTypeId',
      'etapeTypeId',
      'documentTypeId'
    ],

    properties: {
      titreTypeId: { type: 'string', maxLength: 3 },
      demarcheTypeId: { type: 'string', maxLength: 3 },
      etapeTypeId: { type: 'string', maxLength: 3 },
      documentTypeId: { type: 'string', maxLength: 3 },
      optionnel: { type: 'boolean' }
    }
  }

  public static idColumn = [
    'titreTypeId',
    'demarcheTypeId',
    'etapeTypeId',
    'documentTypeId'
  ]
}

export default TitresTypesDemarchesTypesEtapesTypesDocumentsTypes
