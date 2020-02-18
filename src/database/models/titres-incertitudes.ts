import { Model } from 'objection'
import { ITitreIncertitudes } from '../../types'

interface TitresIncertitudes extends ITitreIncertitudes {}

class TitresIncertitudes extends Model {
  public static tableName = 'titresIncertitudes'

  public static jsonSchema = {
    type: 'object',
    required: ['titreEtapeId'],

    properties: {
      titreEtapeId: { type: 'string', maxLength: 128 },
      date: { type: ['null', 'boolean'] },
      dateDebut: { type: ['null', 'boolean'] },
      dateFin: { type: ['null', 'boolean'] },
      duree: { type: ['null', 'boolean'] },
      surface: { type: ['null', 'boolean'] },
      volume: { type: ['null', 'boolean'] },
      engagement: { type: ['null', 'boolean'] },
      points: { type: ['null', 'boolean'] },
      substances: { type: ['null', 'boolean'] },
      titulaires: { type: ['null', 'boolean'] },
      amodiataires: { type: ['null', 'boolean'] },
      administrations: { type: ['null', 'boolean'] }
    }
  }

  public static idColumn = 'titreEtapeId'
}
export default TitresIncertitudes
