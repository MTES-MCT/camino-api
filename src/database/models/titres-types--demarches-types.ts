import { Model } from 'objection'
import { ITitreTypeDemarcheType } from '../../types'

interface TitresTypesDemarchesTypes extends ITitreTypeDemarcheType {}

class TitresTypesDemarchesTypes extends Model {
  public static tableName = 'titresTypes__demarchesTypes'

  public static jsonSchema = {
    type: 'object',
    required: ['titreTypeId', 'demarcheTypeId'],

    properties: {
      titreTypeId: { type: 'string', maxLength: 3 },
      demarcheTypeId: { type: 'string', maxLength: 3 },
      dureeMax: { type: ['integer', 'null'] },
      acceptationImplicite: { type: ['boolean', 'null'] },
      delaiImplicite: { type: ['integer', 'null'] },
      delaiRecours: { type: ['integer', 'null'] },
      legalRef: { type: ['integer', 'null'] },
      legaleLien: { type: ['integer', 'null'] },
      dateDebut: { type: ['integer', 'null'] },
      dateFin: { type: ['integer', 'null'] }
    }
  }

  public static idColumn = ['titreTypeId', 'demarcheTypeId']
}

export default TitresTypesDemarchesTypes
