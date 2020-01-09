import { Model, Modifiers, Pojo } from 'objection'
import { join } from 'path'
import ActivitesStatuts from './activites-statuts'
import ActivitesTypes from './activites-types'
import Utilisateurs from './utilisateurs'

export default class TitresActivites extends Model {
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
      modelClass: ActivitesTypes,
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

  public static modifiers: Modifiers = {
    orderDesc: builder => {
      builder.orderBy('date', 'desc')
    }
  }

  public id!: string
  public titreId!: string
  public utilisateurId?: string
  public date!: string
  public dateSaisie?: string
  // TODO: créer une interfaceIActiviteContenu
  public contenu?: any
  public activiteTypeId!: string
  public activiteStatutId!: string
  public frequencePeriodeId!: number
  public annee!: number

  public $parseJson(json: Pojo) {
    json = super.$parseJson(json)

    if (!json.id) {
      const id = `${json.titreId}-${json.activiteTypeId}-${
        json.annee
      }-${json.frequencePeriodeId.toString().padStart(2, '0')}`
      json.id = id
    }

    return json
  }
}
