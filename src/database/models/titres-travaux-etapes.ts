import { Model, Modifiers, Pojo, QueryContext } from 'objection'
import { join } from 'path'

import { ITitreTravauxEtape } from '../../types'
import { idGenerate } from './_format/id-create'

interface TitresTravauxEtapes extends ITitreTravauxEtape {}

class TitresTravauxEtapes extends Model {
  public static tableName = 'titresTravauxEtapes'

  public static jsonSchema = {
    type: 'object',
    required: ['titreTravauxId', 'date'],

    properties: {
      id: { type: 'string', maxLength: 128 },
      slug: { type: 'string' },
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
      modelClass: join(__dirname, 'travaux-etapes-types'),
      join: {
        from: 'titresTravauxEtapes.typeId',
        to: 'travauxEtapesTypes.id'
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

    travaux: {
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
        from: 'titresTravauxEtapes.id',
        to: 'documents.titreTravauxEtapeId'
      }
    }
  }

  public static modifiers: Modifiers = {
    orderDesc: builder => {
      builder.orderBy('ordre', 'desc')
    }
  }

  async $beforeInsert(context: QueryContext) {
    if (!this.id) {
      this.id = idGenerate()
    }

    if (!this.slug && this.titreTravauxId && this.typeId) {
      this.slug = `${this.titreTravauxId}-${this.typeId}99`
    }

    return super.$beforeInsert(context)
  }

  public $formatDatabaseJson(json: Pojo) {
    delete json.modification
    delete json.suppression
    json = super.$formatDatabaseJson(json)

    return json
  }

  public $parseJson(json: Pojo) {
    delete json.modification
    delete json.suppression
    json = super.$parseJson(json)

    return json
  }
}

export default TitresTravauxEtapes
