import { Model } from 'objection'
import AdministrationsTypes from './administrations-types'
import Domaines from './domaines'
import { join } from 'path'

export default class Administrations extends Model {
  static tableName = 'administrations'

  static jsonSchema = {
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
      regionId: { type: ['string', 'null'] }
    }
  }

  static relationMappings = {
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

    titresAdministrationsCentrales: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'titres'),
      join: {
        from: 'administrations.id',
        through: {
          from: 'titresAdministrationsCentrales.administrationId',
          to: 'titresAdministrationsCentrales.titreId'
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
}
