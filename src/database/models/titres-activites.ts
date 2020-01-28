import { Model, Modifiers, Pojo } from 'objection'
import { join } from 'path'

import { ITitresActivites } from '../../types'

interface TitresActivites extends ITitresActivites {}

class TitresActivites extends Model {
  public static tableName = 'titresActivites'

  public static jsonSchema = {
    type: 'object',
    required: [
      'id',
      'titreId',
      'date',
      'activiteTypeId',
      'activiteStatutId',
      'frequencePeriodeId',
      'annee'
    ],
    properties: {
      id: { type: 'string' },
      titreId: { type: 'string' },
      utilisateurId: { type: ['string', 'null'] },
      date: { type: 'string' },
      dateSaisie: { type: ['string', 'null'] },
      contenu: { type: 'json' },
      activiteTypeId: { type: 'string', maxLength: 3 },
      activiteStatutId: { type: 'string', maxLength: 3 },
      frequencePeriodeId: { type: 'integer' },
      annee: { type: 'integer', maxLength: 4 }
    }
  }

  public static relationMappings = {
    type: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'activites-types'),
      join: {
        from: 'titresActivites.activiteTypeId',
        to: 'activitesTypes.id'
      }
    },

    titre: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'titres'),
      join: {
        from: 'titresActivites.titreId',
        to: 'titres.id'
      }
    },

    statut: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'activites-statuts'),
      join: {
        from: 'titresActivites.activiteStatutId',
        to: 'activitesStatuts.id'
      }
    },

    utilisateur: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'utilisateurs'),
      join: {
        from: 'titresActivites.utilisateurId',
        to: 'utilisateurs.id'
      }
    }
  }

  public static modifiers: Modifiers = {
    orderDesc: builder => {
      builder
        .joinRelated('type')
        .orderByRaw(
          "date desc, array_position(array['ann','tri','men']::varchar[], type.frequence_id)"
        )
    }
  }

  public $parseJson(json: Pojo) {
    json = super.$parseJson(json)

    if (
      !json.id &&
      json.titreId &&
      json.activiteTypeId &&
      json.frequencePeriodeId
    ) {
      const id = `${json.titreId}-${json.activiteTypeId}-${
        json.annee
      }-${json.frequencePeriodeId.toString().padStart(2, '0')}`
      json.id = id
    }

    return json
  }
}

export default TitresActivites
