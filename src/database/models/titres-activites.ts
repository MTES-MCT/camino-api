import { Model, Modifiers, Pojo, QueryContext } from 'objection'
import { join } from 'path'

import { ITitreActivite } from '../../types'
import { idGenerate } from './_format/id-create'

interface TitresActivites extends ITitreActivite {}

class TitresActivites extends Model {
  public static tableName = 'titresActivites'

  public static jsonSchema = {
    type: 'object',

    required: ['titreId', 'date', 'typeId', 'statutId', 'periodeId', 'annee'],

    properties: {
      id: { type: 'string' },
      slug: { type: 'string' },
      titreId: { type: 'string' },
      utilisateurId: { type: ['string', 'null'] },
      date: { type: 'string' },
      dateSaisie: { type: ['string', 'null'] },
      contenu: { type: 'json' },
      typeId: { type: 'string', maxLength: 3 },
      statutId: { type: 'string', maxLength: 3 },
      periodeId: { type: 'integer' },
      annee: { type: 'integer', maxLength: 4 },
      sections: { type: 'json' }
    }
  }

  public static relationMappings = {
    type: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'activites-types'),
      join: {
        from: 'titresActivites.typeId',
        to: 'activitesTypes.id'
      }
    },

    titre: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'titres'),
      join: {
        from: 'titresActivites.titreId',
        to: 'titres.id'
      }
    },

    statut: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'activites-statuts'),
      join: {
        from: 'titresActivites.statutId',
        to: 'activitesStatuts.id'
      }
    },

    utilisateur: {
      relation: Model.BelongsToOneRelation,
      modelClass: join(__dirname, 'utilisateurs'),
      join: {
        from: 'titresActivites.utilisateurId',
        to: 'utilisateurs.id'
      }
    },

    documentsTypes: {
      relation: Model.HasManyRelation,
      modelClass: join(__dirname, 'documents-types'),
      join: {
        from: 'titresActivites.typeId',
        to: 'activitesTypes__documentsTypes.activiteTypeId'
      }
    },

    documents: {
      relation: Model.HasManyRelation,
      modelClass: join(__dirname, 'documents'),
      join: {
        from: 'titresActivites.id',
        to: 'documents.titreActiviteId'
      }
    }
  }

  public static modifiers: Modifiers = {
    orderDesc: builder => {
      builder
        .joinRelated('type')
        .orderByRaw(
          "date desc, array_position(array['ann','tri','men']::varchar[], type.frequence_id), type.ordre"
        )
    }
  }

  async $beforeInsert(context: QueryContext) {
    if (!this.id) {
      this.id = idGenerate()
    }
    if (!this.slug && this.titreId && this.typeId && this.periodeId) {
      this.slug = `${this.titreId}-${this.typeId}-${this.annee}-${this.periodeId
        .toString()
        .padStart(2, '0')}`
    }

    return super.$beforeInsert(context)
  }

  public $parseJson(json: Pojo) {
    delete json.modification
    json = super.$parseJson(json)

    return json
  }

  public $formatDatabaseJson(json: Pojo) {
    delete json.modification
    json = super.$formatDatabaseJson(json)

    return json
  }
}

export default TitresActivites
