const { Model } = require('objection')
const Domaines = require('./titres-domaines')
const Types = require('./titres-types')
const Statuts = require('./titres-statuts')
const Travaux = require('./titres-travaux')
const Substances = require('./substances')
const TitresPhases = require('./titres-phases')

class Titres extends Model {
  static get tableName() {
    return 'titres'
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['id', 'nom', 'domaineId', 'typeId', 'statutId', 'travauxId'],

      properties: {
        id: { type: 'string' },
        nom: { type: 'string' },
        domaineId: { type: 'string', maxLength: 1 },
        typeId: { type: 'string', maxLength: 3 },
        statutId: { type: 'string', maxLength: 3 },
        travauxId: { type: 'string', maxLength: 3 }
      }
    }
  }

  static get relationMappings() {
    return {
      domaine: {
        relation: Model.BelongsToOneRelation,
        modelClass: Domaines,
        join: {
          from: 'titres.domaineId',
          to: 'titresDomaines.id'
        }
      },
      type: {
        relation: Model.BelongsToOneRelation,
        modelClass: Types,
        join: {
          from: 'titres.typeId',
          to: 'titresTypes.id'
        }
      },
      statut: {
        relation: Model.BelongsToOneRelation,
        modelClass: Statuts,
        join: {
          from: 'titres.statutId',
          to: 'titresStatuts.id'
        }
      },
      travaux: {
        relation: Model.BelongsToOneRelation,
        modelClass: Travaux,
        join: {
          from: 'titres.travauxId',
          to: 'titresTravaux.id'
        }
      },
      substancesPrincipales: {
        relation: Model.ManyToManyRelation,
        modelClass: Substances,
        join: {
          from: 'titres.id',
          through: {
            from: 'titresSubstancesPrincipales.titreId',
            to: 'titresSubstancesPrincipales.substanceId'
          },
          to: 'substances.id'
        }
      },
      substancesSecondaires: {
        relation: Model.ManyToManyRelation,
        modelClass: Substances,
        join: {
          from: 'titres.id',
          through: {
            from: 'titresSubstancesSecondaires.titreId',
            to: 'titresSubstancesSecondaires.substanceId'
          },
          to: 'substances.id'
        }
      },
      phases: {
        relation: Model.HasManyRelation,
        modelClass: TitresPhases,
        join: {
          from: 'titres.id',
          to: 'titresPhases.titreId'
        }
      }
    }
  }

  // async $beforeDelete(opt, context) {
  //   await super.$beforeDelete(opt, context)
  //   return console.log('------------------------->', this)
  // }

  // $afterGet(queryContext) {
  //   return console.log('after insert ----------------------', queryContext)
  // }
}

module.exports = Titres
