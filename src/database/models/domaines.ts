import { IDomaine } from '../../types'
import { Model, Modifiers } from 'objection'
import { join } from 'path'
import { AutorisationsDomaines } from './autorisations'

interface Domaines extends IDomaine {}

class Domaines extends Model {
  public static tableName = 'domaines'

  public static jsonSchema = {
    type: 'object',
    required: ['id', 'nom'],

    properties: {
      id: { type: 'string', maxLength: 1 },
      nom: { type: 'string' },
      ordre: { type: 'integer' }
    }
  }

  public static relationMappings = {
    titresTypes: {
      relation: Model.HasManyRelation,
      modelClass: join(__dirname, 'titres-types'),
      join: {
        from: 'domaines.id',
        to: 'titresTypes.domaineId'
      }
    },

    autorisation: {
      relation: Model.BelongsToOneRelation,
      modelClass: AutorisationsDomaines,
      join: {
        from: 'domaines.id',
        to: 'a__domaines.domaineId'
      }
    }
  }

  public static modifiers: Modifiers = {
    orderAsc: builder => {
      builder.orderBy('ordre', 'asc')
    }
  }
}

export default Domaines
