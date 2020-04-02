import { Model } from 'objection'
import { join } from 'path'

import { IAdministration } from '../../types'

interface Administrations extends IAdministration {}

class Administrations extends Model {
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
      modelClass: join(__dirname, 'administrations-types'),
      join: {
        from: 'administrations.typeId',
        to: 'administrationsTypes.id'
      }
    },

    titresTypes: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'titres-types'),
      join: {
        from: 'administrations.id',
        through: {
          from: 'a__titresTypes__administrations.administrationId',
          to: 'a__titresTypes__administrations.titreTypeId',
          extra: ['gestionnaire', 'associee']
        },
        to: 'titresTypes.id'
      }
    },

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

    titresAdministrationGestionnaire: {
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

    titresAdministrationLocale: {
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

export default Administrations
