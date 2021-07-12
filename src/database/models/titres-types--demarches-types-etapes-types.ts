import { Model } from 'objection'
import { join } from 'path'
import { ITitreTypeDemarcheTypeEtapeType } from '../../types'
import EtapesTypes from './etapes-types'

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
    titreType: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'titres-types'),
      join: {
        from: 'titresTypes__demarchesTypes__etapesTypes.titreTypeId',
        to: 'titresTypes.id'
      }
    },
    demarcheType: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'demarches-types'),
      join: {
        from: 'titresTypes__demarchesTypes__etapesTypes.demarcheTypeId',
        to: 'demarchesTypes.id'
      }
    },
    etapeType: {
      relation: Model.BelongsToOneRelation,
      modelClass: EtapesTypes,
      join: {
        from: 'titresTypes__demarchesTypes__etapesTypes.etapeTypeId',
        to: 'etapesTypes.id'
      }
    }
  }
}

export default TitresTypesDemarchesTypesEtapesTypes
