import { Model } from 'objection'
import taxesTypes from './taxes-types'
import taxesStatuts from './taxes-statuts'

export default class TitresTaxes extends Model {
  static tableName = 'titresTaxes'

  static jsonSchema = {
    type: 'object',
    required: [
      'id',
      'titreId',
      'contenu',
      'taxeTypeId',
      'frequencePeriodeId',
      'annee'
    ],
    properties: {
      id: { type: 'string' },
      titreId: { type: 'string' },
      date: { type: 'date' },
      dateSaisie: { type: 'date' },
      contenu: { type: 'json' },
      taxeTypeId: { type: 'string', maxLength: 3 },
      taxeStatutId: { type: 'string', maxLength: 3 },
      frequencePeriodeId: { type: 'integer' },
      annee: { type: 'integer', maxLength: 4 }
    }
  }

  static relationMappings = {
    type: {
      relation: Model.BelongsToOneRelation,
      modelClass: taxesTypes,
      join: {
        from: 'titresTaxes.taxeTypeId',
        to: 'taxesTypes.id'
      }
    },

    statut: {
      relation: Model.BelongsToOneRelation,
      modelClass: taxesStatuts,
      join: {
        from: 'titresTaxes.taxeStatutId',
        to: 'taxesStatuts.id'
      }
    }
  }

  $parseJson(json) {
    json = super.$parseJson(json)

    if (!json.id) {
      const id = `${json.titreId}-${json.taxeTypeId}-${
        json.annee
      }-${json.frequencePeriodeId.toString().padStart(2, '0')}`
      json.id = id
    }

    return json
  }

  static namedFilters = {
    orderDesc: builder => {
      builder.orderBy('date', 'desc')
    }
  }
}
