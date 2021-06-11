import { Model, Modifiers, Pojo } from 'objection'
import { join } from 'path'

import { ITitreTravaux } from '../../types'

interface TitresTravaux extends ITitreTravaux {}

class TitresTravaux extends Model {
  public static tableName = 'titresTravaux'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'titreId', 'typeId'],

    properties: {
      id: { type: 'string', maxLength: 128 },
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

  public $parseJson(json: Pojo) {
    if (!json.id && json.titreId && json.typeId) {
      json.id = `${json.titreId}-${json.typeId}99`
    }

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
