import { Model, Modifiers, Pojo } from 'objection'
import GeoSystemes from './geo-systemes'
import Unites from './unites'

interface ICoordonnees {
  x: number
  y: number
}

export default class TitresPointsReferences extends Model {
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
      modelClass: GeoSystemes,
      join: {
        from: 'titresPointsReferences.geoSystemeId',
        to: 'geoSystemes.id'
      }
    },

    unite: {
      relation: Model.BelongsToOneRelation,
      modelClass: Unites,
      join: {
        from: 'titresPointsReferences.uniteId',
        to: 'unites.id'
      }
    }
  }

  public static jsonAttributes = []

  public static modifiers: Modifiers = {
    orderAsc: builder => {
      builder.orderBy('geoSystemeId', 'asc')
    }
  }

  public id!: string
  public titrePointId!: string
  public geoSystemeId!: string
  public coordonnees!: ICoordonnees
  public opposable?: boolean
  public geoSysteme!: GeoSystemes
  public unite!: Unites

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
