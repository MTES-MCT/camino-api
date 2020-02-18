import { Model } from 'objection'
import { join } from 'path'

import { IFrequence } from '../../types'

interface Frequences extends IFrequence {}

class Frequences extends Model {
  public static tableName = 'frequences'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom', 'periodesNom'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: 'string' },
      periodesNom: { type: 'string' }
    }
  }

  public static relationMappings = {
    annees: {
      relation: Model.HasManyRelation,
      modelClass: join(__dirname, 'annees'),
      join: {
        from: 'frequences.id',
        to: 'annees.frequenceId'
      }
    },

    trimestres: {
      relation: Model.HasManyRelation,
      modelClass: join(__dirname, 'trimestres'),
      join: {
        from: 'frequences.id',
        to: 'trimestres.frequenceId'
      }
    },

    mois: {
      relation: Model.HasManyRelation,
      modelClass: join(__dirname, 'mois'),
      join: {
        from: 'frequences.id',
        to: 'mois.frequenceId'
      }
    }
  }
}

export default Frequences
