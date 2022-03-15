import { Model, Modifiers, Pojo, QueryContext } from 'objection'

import { ITitreDemarche } from '../../types'
import { idGenerate } from './_format/id-create'
import DemarchesTypes from './demarches-types'
import DemarchesStatuts from './demarches-statuts'
import TitresTypes from './titres-types'
import Titres from './titres'
import TitresEtapes from './titres-etapes'
import TitresPhases from './titres-phases'

export interface DBTitresDemarches extends ITitreDemarche {
  archive: boolean
}

interface TitresDemarches extends DBTitresDemarches {}

class TitresDemarches extends Model {
  public static tableName = 'titresDemarches'

  public static jsonSchema = {
    type: 'object',
    required: ['titreId', 'typeId'],

    properties: {
      id: { type: 'string', maxLength: 128 },
      slug: { type: 'string' },
      titreId: { type: 'string', maxLength: 128 },
      typeId: { type: 'string', maxLength: 8 },
      statutId: { type: 'string', maxLength: 3 },
      ordre: { type: 'integer' },
      description: { type: ['string', 'null'] },
      archive: { type: 'boolean' }
    }
  }

  static relationMappings = () => ({
    type: {
      relation: Model.BelongsToOneRelation,
      modelClass: DemarchesTypes,
      join: {
        from: 'titresDemarches.typeId',
        to: 'demarchesTypes.id',
        extra: { titreId: 'titresDemarches.titreId' }
      }
    },

    statut: {
      relation: Model.BelongsToOneRelation,
      modelClass: DemarchesStatuts,
      join: {
        from: 'titresDemarches.statutId',
        to: 'demarchesStatuts.id'
      }
    },

    // todo: pourquoi ne pas utiliser la relation `titre` ?
    titreType: {
      relation: Model.HasOneThroughRelation,
      modelClass: TitresTypes,
      join: {
        from: 'titresDemarches.titreId',
        through: {
          from: 'titres.id',
          to: 'titres.typeId'
        },
        to: 'titresTypes.id'
      }
    },

    titre: {
      relation: Model.BelongsToOneRelation,
      modelClass: Titres,
      join: {
        from: 'titresDemarches.titreId',
        to: 'titres.id'
      }
    },

    etapes: {
      relation: Model.HasManyRelation,
      modelClass: TitresEtapes,
      join: {
        from: 'titresDemarches.id',
        to: 'titresEtapes.titreDemarcheId'
      }
    },

    phase: {
      relation: Model.HasOneRelation,
      modelClass: TitresPhases,
      join: {
        from: 'titresDemarches.id',
        to: 'titresPhases.titreDemarcheId'
      }
    },

    parents: {
      relation: Model.ManyToManyRelation,
      modelClass: TitresDemarches,
      join: {
        from: 'titresDemarches.id',
        through: {
          from: 'titresDemarchesLiens.enfantTitreDemarcheId',
          to: 'titresDemarchesLiens.parentTitreDemarcheId'
        },
        to: 'titresDemarches.id'
      }
    },

    enfants: {
      relation: Model.ManyToManyRelation,
      modelClass: TitresDemarches,
      join: {
        from: 'titresDemarches.id',
        through: {
          from: 'titresDemarchesLiens.parentTitreDemarcheId',
          to: 'titresDemarchesLiens.enfantTitreDemarcheId'
        },
        to: 'titresDemarches.id'
      }
    }
  })

  public static modifiers: Modifiers = {
    orderDesc: builder => {
      builder.orderBy('ordre', 'desc')
    }
  }

  async $beforeInsert(context: QueryContext) {
    if (!this.id) {
      this.id = idGenerate()
    }

    if (!this.slug && this.titreId && this.typeId) {
      this.slug = `${this.titreId}-${this.typeId}99`
    }

    return super.$beforeInsert(context)
  }

  public $parseJson(json: Pojo) {
    delete json.modification
    delete json.suppression
    delete json.etapesCreation
    json = super.$parseJson(json)

    return json
  }

  public $formatDatabaseJson(json: Pojo) {
    delete json.modification
    delete json.suppression
    delete json.etapesCreation
    json = super.$formatDatabaseJson(json)

    return json
  }
}

export default TitresDemarches
