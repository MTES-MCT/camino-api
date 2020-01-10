import { Model, Modifiers, Pojo } from 'objection'
import TitresPointsReferences from './titres-points-references'

interface ICoordonnees {
  x: number
  y: number
}

export default class TitresPoints extends Model {
  public static tableName = 'titresPoints'

  public static jsonSchema = {
    type: 'object',
    required: ['titreEtapeId', 'coordonnees', 'groupe', 'contour', 'point'],

    properties: {
      id: { type: 'string' },
      titreEtapeId: { type: 'string', maxLength: 128 },
      nom: { type: ['string', 'null'] },
      description: { type: ['string', 'null'] },
      coordonnees: {
        type: 'object',
        properties: {
          x: { type: 'number' },
          y: { type: 'number' }
        }
      },
      groupe: { type: 'integer' },
      contour: { type: 'integer' },
      point: { type: 'integer' },
      lot: { type: ['integer', 'null'] },
      securite: { type: ['boolean', 'null'] },
      subsidiaire: { type: ['boolean', 'null'] }
    }
  }

  public static relationMappings = {
    references: {
      relation: Model.HasManyRelation,
      modelClass: TitresPointsReferences,
      join: {
        from: 'titresPoints.id',
        to: 'titresPointsReferences.titrePointId'
      }
    }
  }

  public static modifiers: Modifiers = {
    orderAsc: builder => {
      builder.orderBy([
        { column: 'groupe' },
        { column: 'contour' },
        { column: 'point' }
      ])
    }
  }

  public id!: string
  public titreEtapeId!: string
  public nom?: string
  public description?: string
  public coordonnees!: ICoordonnees
  public groupe!: number
  public contour!: number
  public point!: number
  public lot?: number
  public securite?: boolean
  public subsidiaire?: boolean
  public references!: TitresPointsReferences[]

  public $parseJson(json: Pojo) {
    json = super.$parseJson(json)

    if (
      !json.id &&
      json.titreEtapeId &&
      json.groupe &&
      json.contour &&
      json.point
    ) {
      json.id = `${json.titreEtapeId}-g${json.groupe
        .toString()
        .padStart(2, '0')}-c${json.contour
        .toString()
        .padStart(2, '0')}-p${json.point.toString().padStart(3, '0')}`
    }

    if (json.references) {
      json.references.forEach((reference: TitresPointsReferences) => {
        reference.titrePointId = json.id
      })
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
