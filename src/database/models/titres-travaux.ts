import { Model, Modifiers, Pojo, QueryContext } from 'objection'
import { join } from 'path'

import { ITitreTravaux } from '../../types'
import { idGenerate } from './_format/id-create'

interface TitresTravaux extends ITitreTravaux {}

class TitresTravaux extends Model {
  public static tableName = 'titresTravaux'

  public static jsonSchema = {
    type: 'object',
    required: ['titreId', 'typeId'],

    properties: {
      id: { type: 'string', maxLength: 128 },
      slug: { type: 'string' },
      titreId: { type: 'string', maxLength: 128 },
      typeId: { type: 'string', maxLength: 8 },
      statutId: { type: 'string', maxLength: 3 },
      ordre: { type: 'integer' }
    }
  }

  public static relationMappings = {
    type: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'travaux-types'),
      join: {
        from: 'titresTravaux.typeId',
        to: 'travauxTypes.id'
      }
    },

    statut: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'demarches-statuts'),
      join: {
        from: 'titresTravaux.statutId',
        to: 'demarchesStatuts.id'
      }
    },

    titre: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'titres'),
      join: {
        from: 'titresTravaux.titreId',
        to: 'titres.id'
      }
    },

    travauxEtapes: {
      relation: Model.HasManyRelation,
      modelClass: join(__dirname, 'titres-travaux-etapes'),
      join: {
        from: 'titresTravaux.id',
        to: 'titresTravauxEtapes.titreTravauxId'
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

    if (!this.slug && this.titreId && this.typeId) {
      this.slug = `${this.titreId}-${this.typeId}99`
    }

    return super.$beforeInsert(context)
  }

  public $parseJson(json: Pojo) {
    delete json.modification
    delete json.suppression
    delete json.etapesCreation
    json = super.$parseJson(json)

    return json
  }

  public $formatDatabaseJson(json: Pojo) {
    delete json.modification
    delete json.suppression
    delete json.etapesCreation
    json = super.$formatDatabaseJson(json)

    return json
  }
}

export default TitresTravaux
