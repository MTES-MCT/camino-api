import { Model } from 'objection'

import { IFrequence } from '../../types'
import Annees from './annees'
import Trimestres from './trimestres'
import Mois from './mois'

interface Frequences extends IFrequence {}

class Frequences extends Model {
  public static tableName = 'frequences'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom', 'periodesNom'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: 'string' },
      periodesNom: { enum: ['annees', 'trimestres', 'mois'] }
    }
  }

  static relationMappings = () => ({
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
  })
}

export default Frequences
