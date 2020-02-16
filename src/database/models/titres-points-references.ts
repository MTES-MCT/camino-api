import { Model, Modifiers, Pojo } from 'objection'
import { join } from 'path'
import { ITitrePointReference } from '../../types'

interface TitresPointsReferences extends ITitrePointReference {}

class TitresPointsReferences extends Model {
  public static tableName = 'titresPointsReferences'

  public static jsonSchema = {
    type: 'object',
    required: ['titrePointId', 'id', 'geoSystemeId', 'coordonnees'],

    properties: {
      id: { type: 'string' },
      titrePointId: { type: 'string' },
      geoSystemeId: { type: 'string' },
      coordonnees: {
        type: 'object',
        properties: {
          x: { type: 'number' },
          y: { type: 'number' }
        }
      },
      opposable: { type: ['boolean', 'null'] }
    }
  }

  public static relationMappings = {
    geoSysteme: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'geo-systemes'),
      join: {
        from: 'titresPointsReferences.geoSystemeId',
        to: 'geoSystemes.id'
      }
    }
  }

  public static jsonAttributes = []

  public static modifiers: Modifiers = {
    orderAsc: builder => {
      builder.orderBy('geoSystemeId', 'asc')
    }
  }

  public $parseJson(json: Pojo) {
    json = super.$parseJson(json)

    if (!json.id && json.titrePointId && json.geoSystemeId) {
      json.id = `${json.titrePointId}-${json.geoSystemeId}`
    }

    return json
  }

  public $formatDatabaseJson(json: Pojo) {
    if (json.coordonnees) {
      json.coordonnees = `${json.coordonnees.x},${json.coordonnees.y}`
    }

    json = super.$formatDatabaseJson(json)

    return json
  }
}

export default TitresPointsReferences
