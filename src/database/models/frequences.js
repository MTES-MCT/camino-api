import { Model } from 'objection'
import Annees from './annees'
import Trimestres from './trimestres'

import Mois from './mois'

export default class Frequences extends Model {
  static tableName = 'frequences'

  static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: 'string' },
      periodesNom: { type: 'string' }
    }
  }

  static relationMappings = {
    annees: {
      relation: Model.HasManyRelation,
      modelClass: Annees,
      join: {
        from: 'frequences.id',
        to: 'annees.frequenceId'
      }
    },

    trimestres: {
      relation: Model.HasManyRelation,
      modelClass: Trimestres,
      join: {
        from: 'frequences.id',
        to: 'trimestres.frequenceId'
      }
    },

    mois: {
      relation: Model.HasManyRelation,
      modelClass: Mois,
      join: {
        from: 'frequences.id',
        to: 'mois.frequenceId'
      }
    }
  }
}
