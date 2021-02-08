import { Model, Pojo } from 'objection'
import { join } from 'path'

import { IEntreprise } from '../../types'

interface Entreprises extends IEntreprise {}

class Entreprises extends Model {
  public static tableName = 'entreprises'

  public static jsonSchema = {
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
      url: { type: ['string', 'null'] },
      archive: { type: 'boolean' }
    }
  }

  public static relationMappings = {
    etablissements: {
      relation: Model.HasManyRelation,
      modelClass: join(__dirname, 'entreprises-etablissements'),
      join: {
        from: 'entreprises.id',
        to: 'entreprisesEtablissements.entrepriseId'
      }
    },

    utilisateurs: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'utilisateurs'),
      join: {
        from: 'entreprises.id',
        through: {
          from: 'utilisateurs__entreprises.entrepriseId',
          to: 'utilisateurs__entreprises.utilisateurId'
        },
        to: 'utilisateurs.id'
      }
    },

    titulaireTitres: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'titres'),
      join: {
        from: 'entreprises.id',
        through: {
          from: 'titresTitulaires.entrepriseId',
          to: 'titresTitulaires.titreEtapeId'
        },
        to: 'titres.titulairesTitreEtapeId'
      }
    },

    amodiataireTitres: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'titres'),
      join: {
        from: 'entreprises.id',
        through: {
          from: 'titresAmodiataires.entrepriseId',
          to: 'titresAmodiataires.titreEtapeId'
        },
        to: 'titres.amodiatairesTitreEtapeId'
      }
    },

    documents: {
      relation: Model.HasManyRelation,
      modelClass: join(__dirname, 'documents'),
      join: {
        from: 'entreprises.id',
        to: 'documents.entrepriseId'
      }
    }
  }

  public $parseJson(json: Pojo) {
    json = super.$parseJson(json)
    if (json.id) {
      json.id = json.id.toLowerCase()
    }

    if (json.utilisateursIds) {
      json.utilisateurs = json.utilisateursIds.map((id: string) => ({
        id
      }))

      delete json.utilisateursIds
    }

    delete json.modification

    return json
  }

  public $formatDatabaseJson(json: Pojo) {
    delete json.modification

    json = super.$formatDatabaseJson(json)

    return json
  }
}

export default Entreprises
