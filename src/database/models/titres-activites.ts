import { Model, Modifiers, Pojo } from 'objection'
import { join } from 'path'

import { ITitreActivite } from '../../types'

interface TitresActivites extends ITitreActivite {}

class TitresActivites extends Model {
  public static tableName = 'titresActivites'

  public static jsonSchema = {
    type: 'object',
    required: [
      'id',
      'titreId',
      'date',
      'typeId',
      'statutId',
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
      typeId: { type: 'string', maxLength: 3 },
      statutId: { type: 'string', maxLength: 3 },
      frequencePeriodeId: { type: 'integer' },
      annee: { type: 'integer', maxLength: 4 }
    }
  }

  public static relationMappings = {
    type: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'activites-types'),
      join: {
        from: 'titresActivites.typeId',
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
        from: 'titresActivites.statutId',
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
    },

    documents: {
      relation: Model.HasManyRelation,
      modelClass: join(__dirname, 'documents'),
      join: {
        from: 'titresActivites.id',
        to: 'documents.titreActiviteId'
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

    if (!json.id && json.titreId && json.typeId && json.frequencePeriodeId) {
      const id = `${json.titreId}-${json.typeId}-${
        json.annee
      }-${json.frequencePeriodeId.toString().padStart(2, '0')}`
      json.id = id
    }

    delete json.modification

    return json
  }

  public $formatDatabaseJson(json: Pojo) {
    json = super.$formatDatabaseJson(json)

    delete json.modification

    return json
  }
}

export default TitresActivites
