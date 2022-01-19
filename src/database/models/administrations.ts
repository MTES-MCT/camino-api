import { Model, ref } from 'objection'

import { IAdministration } from '../../types'

import AdministrationsTitresTypesEtapesTypes from './administrations-titres-types-etapes-types'
import AdministrationsTitresTypesTitresStatuts from './administrations-titres-types-titres-statuts'
import AdministrationsTypes from './administrations-types'
import TitresTypes from './titres-types'
import Utilisateurs from './utilisateurs'
import Titres from './titres'
import ActivitesTypes from './activites-types'
import Departements from './departements'
import Regions from './regions'

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

  static relationMappings = () => ({
    type: {
      relation: Model.BelongsToOneRelation,
      modelClass: AdministrationsTypes,
      join: {
        from: 'administrations.typeId',
        to: 'administrationsTypes.id'
      }
    },

    titresTypes: {
      relation: Model.ManyToManyRelation,
      modelClass: TitresTypes,
      join: {
        from: 'administrations.id',
        through: {
          from: 'administrations__titresTypes.administrationId',
          to: 'administrations__titresTypes.titreTypeId',
          extra: ['gestionnaire', 'associee']
        },
        to: 'titresTypes.id'
      }
    },

    titresTypesTitresStatuts: {
      relation: Model.HasManyRelation,
      modelClass: AdministrationsTitresTypesTitresStatuts,
      join: {
        from: 'administrations.id',
        to: 'administrations__titresTypes__titresStatuts.administrationId'
      }
    },

    titresTypesEtapesTypes: {
      relation: Model.HasManyRelation,
      modelClass: AdministrationsTitresTypesEtapesTypes,
      join: {
        from: 'administrations.id',
        to: 'administrations__titresTypes__etapesTypes.administrationId'
      }
    },

    utilisateurs: {
      relation: Model.ManyToManyRelation,
      modelClass: Utilisateurs,
      join: {
        from: 'administrations.id',
        through: {
          from: 'utilisateurs__administrations.administrationId',
          to: 'utilisateurs__administrations.utilisateurId'
        },
        to: 'utilisateurs.id'
      }
    },

    gestionnaireTitres: {
      relation: Model.ManyToManyRelation,
      modelClass: Titres,
      join: {
        from: 'administrations.id',
        through: {
          from: 'titresAdministrationsGestionnaires.administrationId',
          to: 'titresAdministrationsGestionnaires.titreId'
        },
        to: 'titres.id'
      }
    },

    localeTitres: {
      relation: Model.ManyToManyRelation,
      modelClass: Titres,
      join: {
        from: 'administrations.id',
        through: {
          from: 'titresAdministrationsLocales.administrationId',
          to: 'titresAdministrationsLocales.titreEtapeId'
        },
        to: ref('titres.propsTitreEtapesIds:administrations').castText()
      }
    },

    activitesTypes: {
      relation: Model.ManyToManyRelation,
      modelClass: ActivitesTypes,
      join: {
        from: 'administrations.id',
        through: {
          from: 'administrations__activitesTypes.administrationId',
          to: 'administrations__activitesTypes.activiteTypeId',
          extra: ['modificationInterdit', 'lectureInterdit']
        },
        to: 'activitesTypes.id'
      }
    },

    activitesTypesEmails: {
      relation: Model.ManyToManyRelation,
      modelClass: ActivitesTypes,
      join: {
        from: 'administrations.id',
        through: {
          from: 'administrations__activitesTypes__emails.administrationId',
          to: 'administrations__activitesTypes__emails.activiteTypeId',
          extra: ['email']
        },
        to: 'activitesTypes.id'
      }
    },

    departement: {
      relation: Model.BelongsToOneRelation,
      modelClass: Departements,
      join: {
        from: 'administrations.departementId',
        to: 'departements.id'
      }
    },

    region: {
      relation: Model.BelongsToOneRelation,
      modelClass: Regions,
      join: {
        from: 'administrations.regionId',
        to: 'regions.id'
      }
    }
  })
}

export default Administrations
