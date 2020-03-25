import { Model, Modifiers } from 'objection'
import { join } from 'path'

import { IEtapeType } from '../../types'
import {
  AutorisationsEtapesTypes,
  RestrictionsTitresTypesEtapesTypesAdministrations
} from './autorisations'

interface EtapesTypes extends IEtapeType {}

class EtapesTypes extends Model {
  public static tableName = 'etapesTypes'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: ['string', 'null'], maxLength: 128 },
      acceptationAuto: { type: ['boolean', 'null'] },
      fondamentale: { type: ['boolean', 'null'] },
      dateDebut: { type: ['string', 'null'] },
      dateFin: { type: ['string', 'null'] },
      sections: { type: 'json' }
    }
  }

  public static relationMappings = {
    etapesStatuts: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'etapes-statuts'),
      join: {
        from: 'etapesTypes.id',
        through: {
          from: 'etapesTypes__etapesStatuts.etapeTypeId',
          to: 'etapesTypes__etapesStatuts.etapeStatutId',
          extra: ['ordre']
        },
        to: 'etapesStatuts.id'
      }
    },

    autorisations: {
      relation: Model.HasOneRelation,
      modelClass: AutorisationsEtapesTypes,
      join: {
        from: 'etapesTypes.id',
        to: 'a__etapesTypes.etapeTypeId'
      }
    },

    restrictionsTitresTypesAdministrations: {
      relation: Model.HasManyRelation,
      modelClass: RestrictionsTitresTypesEtapesTypesAdministrations,
      join: {
        from: 'etapesTypes.id',
        to: 'r__titresTypes__etapesTypes__administrations.etapeTypeId'
      }
    }
  }

  public static modifiers: Modifiers = {
    orderAsc: builder => {
      builder.orderBy('etapesTypes.ordre', 'asc')
    }
  }
}

export default EtapesTypes
