import { Model, Modifiers } from 'objection'
import { join } from 'path'

import { IDemarcheType } from '../../types'

interface DemarchesTypes extends IDemarcheType {}

class DemarchesTypes extends Model {
  public static tableName = 'demarchesTypes'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 3 },
      nom: { type: 'string' },
      ordre: { type: ['integer', 'null'] },
      duree: { type: ['boolean', 'null'] },
      points: { type: ['boolean', 'null'] },
      substances: { type: ['boolean', 'null'] },
      titulaires: { type: ['boolean', 'null'] },
      renouvelable: { type: ['boolean', 'null'] },
      exception: { type: ['boolean', 'null'] }
    }
  }

  public static relationMappings = {
    etapesTypes: {
      relation: Model.ManyToManyRelation,
      modelClass: join(__dirname, 'etapes-types'),
      join: {
        from: 'demarchesTypes.id',
        through: {
          from: 'titresTypes__demarchesTypes__etapesTypes.demarcheTypeId',
          to: 'titresTypes__demarchesTypes__etapesTypes.etapeTypeId',
          // permet de donner un alias spécial aux champs extra { alias: field }
          extra: {
            ordre: 'ordre',
            titreTypeId: 'titreTypeId',
            sectionsSpecifiques: 'sections'
          }
        },
        to: 'etapesTypes.id'
      }
    }
  }

  public static modifiers: Modifiers = {
    orderAsc: builder => {
      builder.orderBy('ordre', 'asc')
    }
  }
}

export default DemarchesTypes
