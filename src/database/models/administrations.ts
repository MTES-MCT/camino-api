import { Model } from 'objection'
import { join } from 'path'
import AdministrationsTypes from './administrations-types'
import Domaines from './domaines'
import Titres from './titres'
import Utilisateurs from './utilisateurs'

export default class Administrations extends Model {
  public static tableName = 'administrations'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom', 'typeId'],

    properties: {
      id: { type: 'string', maxLength: 64 },
      typeId: { type: 'string' },
      nom: { type: 'string' },
      service: { type: ['string', 'null'] },
      url: { type: ['string', 'null'] },
      email: { type: ['string', 'null'] },
      telephone: { type: ['string', 'null'] },
      adresse1: { type: ['string', 'null'] },
      adresse2: { type: ['string', 'null'] },
      codePostal: { type: ['string', 'null'] },
      commune: { type: ['string', 'null'] },
      cedex: { type: ['string', 'null'] },
      departementId: { type: ['string', 'null'] },
      regionId: { type: ['string', 'null'] },
      abreviation: { type: ['string', 'null'] }
    }
  }

  public static relationMappings = {
    type: {
      relation: Model.BelongsToOneRelation,
      modelClass: AdministrationsTypes,
      join: {
        from: 'administrations.typeId',
        to: 'administrationsTypes.id'
      }
    },

    domaines: {
      relation: Model.ManyToManyRelation,
      modelClass: Domaines,
      join: {
        from: 'administrations.id',
        through: {
          from: 'administrations__domaines.administrationId',
          to: 'administrations__domaines.domaineId'
        },
        to: 'domaines.id'
      }
    },

    // Utilisateurs est requis par Administrations
    // Administrations est requis par Utilisateurs
    // ce qui provoque une require loop
    // solutions to require loops http://vincit.github.io/objection.js/#relations
    utilisateurs: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'utilisateurs'),
      join: {
        from: 'administrations.id',
        through: {
          from: 'utilisateurs__administrations.administrationId',
          to: 'utilisateurs__administrations.utilisateurId'
        },
        to: 'utilisateurs.id'
      }
    },

    titresAdministrationsGestionnaires: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'titres'),
      join: {
        from: 'administrations.id',
        through: {
          from: 'titresAdministrationsGestionnaires.administrationId',
          to: 'titresAdministrationsGestionnaires.titreId'
        },
        to: 'titres.id'
      }
    },

    titresAdministrationsLocales: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'titres'),
      join: {
        from: 'administrations.id',
        through: {
          from: 'titresAdministrationsLocales.administrationId',
          to: 'titresAdministrationsLocales.titreEtapeId'
        },
        to: 'titres.administrationsTitreEtapeId'
      }
    }
  }

  public id!: string
  public typeId!: string
  public nom!: string
  public service?: string
  public url?: string
  public email?: string
  public telephone?: string
  public adresse1?: string
  public adresse2?: string
  public codePostal?: string
  public commune?: string
  public cedex?: string
  public departementId?: string
  public regionId?: string
  public abreviation?: string
  public type!: AdministrationsTypes
  public domaines?: Domaines[]
  public utilisateurs?: Utilisateurs[]
  public titresAdministrationsGestionnaires?: Titres[]
  public titresAdministrationsLocales?: Titres[]
}
