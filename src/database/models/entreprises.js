import { Model } from 'objection'
import EntreprisesEtablissements from './entreprises-etablissements'

export default class Entreprises extends Model {
  static tableName = 'entreprises'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 64 },
      nom: { type: 'string' },
      paysId: { type: ['string', 'null'] },
      legalSiren: { type: ['string', 'null'] },
      legalEtranger: { type: ['string', 'null'] },
      legalForme: { type: ['string', 'null'] },
      categorie: { type: ['string', 'null'] },
      dateCreation: { type: ['string', 'null'] },
      adresse: { type: ['string', 'null'] },
      codePostal: { type: ['string', 'null'] },
      commune: { type: ['string', 'null'] },
      cedex: { type: ['string', 'null'] },
      email: { type: ['string', 'null'] },
      telephone: { type: ['string', 'null'] },
      url: { type: ['string', 'null'] }
    }
  }

  static relationMappings = {
    etablissements: {
      relation: Model.HasManyRelation,
      modelClass: EntreprisesEtablissements,
      join: {
        from: 'entreprises.id',
        to: 'entreprisesEtablissements.entrepriseId'
      }
    },

    utilisateurs: {
      relation: Model.ManyToManyRelation,
      modelClass: `${__dirname}/utilisateurs`,
      join: {
        from: 'entreprises.id',
        through: {
          from: 'utilisateurs__entreprises.entrepriseId',
          to: 'utilisateurs__entreprises.utilisateurId'
        },
        to: 'utilisateurs.id'
      }
    },

    titresTitulaire: {
      relation: Model.ManyToManyRelation,
      modelClass: `${__dirname}/titres`,
      join: {
        from: 'entreprises.id',
        through: {
          from: 'titresTitulaires.entrepriseId',
          to: 'titresTitulaires.titreEtapeId'
        },
        to: 'titres.titulairesTitreEtapeId'
      }
    },

    titresAmodiataire: {
      relation: Model.ManyToManyRelation,
      modelClass: `${__dirname}/titres`,
      join: {
        from: 'entreprises.id',
        through: {
          from: 'titresAmodiataires.entrepriseId',
          to: 'titresAmodiataires.titreEtapeId'
        },
        to: 'titres.amodiatairesTitreEtapeId'
      }
    }
  }

  $parseJson(json) {
    json = super.$parseJson(json)
    if (json.id) {
      json.id = json.id.toLowerCase()
    }

    if (json.utilisateursIds) {
      json.utilisateurs = json.utilisateursIds.map(id => ({ id }))
      delete json.utilisateursIds
    }

    return json
  }
}
