import { Model, Modifiers, Pojo, QueryContext } from 'objection'
import { join } from 'path'

import { ITitrePointReference } from '../../types'
import { idGenerate } from './_format/id-create'

interface TitresPointsReferences extends ITitrePointReference {}

class TitresPointsReferences extends Model {
  public static tableName = 'titresPointsReferences'

  public static jsonSchema = {
    type: 'object',
    required: ['titrePointId', 'geoSystemeId', 'coordonnees'],

    properties: {
      id: { type: 'string' },
      slug: { type: 'string' },
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

  async $beforeInsert(context: QueryContext) {
    if (!this.id) {
      this.id = idGenerate()
    }

    if (!this.slug && this.titrePointId && this.geoSystemeId) {
      this.slug = `${this.titrePointId}-${this.geoSystemeId}`
    }

    return super.$beforeInsert(context)
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
