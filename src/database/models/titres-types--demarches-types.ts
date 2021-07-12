import { Model } from 'objection'
import { join } from 'path'
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

  public static relationMappings = {
    titreType: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'titres-types'),
      join: {
        from: 'titresTypes__demarchesTypes.titreTypeId',
        to: 'titresTypes.id'
      }
    },
    demarcheType: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'demarches-types'),
      join: {
        from: 'titresTypes__demarchesTypes.demarcheTypeId',
        to: 'demarchesTypes.id'
      }
    }
  }
}

export default TitresTypesDemarchesTypes
