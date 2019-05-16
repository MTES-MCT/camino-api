import { Model } from 'objection'
import ActivitesTypes from './activites-types'
import ActivitesStatuts from './activites-statuts'
import Utilisateurs from './utilisateurs'

export default class TitresActivites extends Model {
  static tableName = 'titresActivites'

  static jsonSchema = {
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
      utilisateurId: { type: 'string' },
      date: { type: 'date' },
      dateSaisie: { type: 'date' },
      contenu: { type: 'json' },
      activiteTypeId: { type: 'string', maxLength: 3 },
      activiteStatutId: { type: 'string', maxLength: 3 },
      frequencePeriodeId: { type: 'integer' },
      annee: { type: 'integer', maxLength: 4 }
    }
  }

  static relationMappings = {
    type: {
      relation: Model.BelongsToOneRelation,
      modelClass: ActivitesTypes,
      join: {
        from: 'titresActivites.activiteTypeId',
        to: 'activitesTypes.id'
      }
    },

    statut: {
      relation: Model.BelongsToOneRelation,
      modelClass: ActivitesStatuts,
      join: {
        from: 'titresActivites.activiteStatutId',
        to: 'activitesStatuts.id'
      }
    },

    utilisateur: {
      relation: Model.BelongsToOneRelation,
      modelClass: Utilisateurs,
      join: {
        from: 'titresActivites.utilisateurId',
        to: 'utilisateurs.id'
      }
    }
  }

  $parseJson(json) {
    json = super.$parseJson(json)

    if (!json.id) {
      const id = `${json.titreId}-${json.activiteTypeId}-${
        json.annee
      }-${json.frequencePeriodeId.toString().padStart(2, '0')}`
      json.id = id
    }

    return json
  }

  static namedFilters = {
    orderByDateDesc: builder => {
      builder.orderBy('date', 'desc')
    }
  }
}
