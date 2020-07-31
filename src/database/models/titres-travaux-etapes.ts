import { Model, Modifiers, Pojo } from 'objection'
import { join } from 'path'
import { ITitreTravauxEtape } from '../../types'

interface TitresTravauxEtapes extends ITitreTravauxEtape {}

class TitresTravauxEtapes extends Model {
  public static tableName = 'titresTravauxEtapes'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'titreTravauxId', 'date'],

    properties: {
      id: { type: 'string', maxLength: 128 },
      titreTravauxId: { type: 'string', maxLength: 128 },
      typeId: { type: 'string', maxLength: 3 },
      statutId: { type: 'string', maxLength: 3 },
      ordre: { type: 'integer' },
      date: { type: ['string', 'null'] },
      duree: { type: ['integer', 'null'] },
      surface: { type: ['number', 'null'] },
      contenu: { type: 'json' }
    }
  }

  public static relationMappings = {
    type: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'etapes-types'),
      join: {
        from: 'titresTravauxEtapes.typeId',
        to: 'etapesTypes.id'
      }
    },

    statut: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'etapes-statuts'),
      join: {
        from: 'titresTravauxEtapes.statutId',
        to: 'etapesStatuts.id'
      }
    },

    demarche: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'titres-travaux'),
      join: {
        from: 'titresTravauxEtapes.titreTravauxId',
        to: 'titresTravaux.id'
      }
    },

    documents: {
      relation: Model.HasManyRelation,
      modelClass: join(__dirname, 'documents'),
      join: {
        from: 'titresEtapes.id',
        to: 'documents.titreEtapeId'
      }
    }
  }

  public static modifiers: Modifiers = {
    orderDesc: builder => {
      builder.orderBy('ordre', 'desc')
    }
  }

  public $formatDatabaseJson(json: Pojo) {
    json = super.$formatDatabaseJson(json)

    delete json.modification
    delete json.suppression

    return json
  }

  public $parseJson(json: Pojo) {
    json = super.$parseJson(json)

    if (!json.id && json.titreTravauxId && json.typeId) {
      json.id = `${json.titreTravauxId}-${json.typeId}99`
    }

    delete json.modification
    delete json.suppression

    return json
  }
}

export default TitresTravauxEtapes
