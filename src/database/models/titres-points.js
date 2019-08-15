import { Model } from 'objection'
import TitresPointsReferences from './titres-points-references'

export default class TitresPoints extends Model {
  static tableName = 'titresPoints'

  static jsonSchema = {
    type: 'object',
    required: ['titreEtapeId', 'coordonnees', 'groupe', 'contour', 'point'],

    properties: {
      id: { type: 'string' },
      titreEtapeId: { type: 'string', maxLength: 128 },
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
      nom: { type: ['string', 'null'] },
      description: { type: ['string', 'null'] },
      securite: { type: ['boolean', 'null'] },
      subsidiaire: { type: ['boolean', 'null'] }
    }
  }

  static relationMappings = {
    references: {
      relation: Model.HasManyRelation,
      modelClass: TitresPointsReferences,
      join: {
        from: 'titresPoints.id',
        to: 'titresPointsReferences.titrePointId'
      }
    }
  }

  $parseJson(json) {
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
      json.references.forEach(reference => {
        reference.titrePointId = json.id
      })
    }

    return json
  }

  $formatDatabaseJson(json) {
    if (json.coordonnees) {
      json.coordonnees = `${json.coordonnees.x},${json.coordonnees.y}`
    }

    json = super.$formatDatabaseJson(json)

    return json
  }
}
